"""Owner-only moderation of the guestbook."""
from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from routes.auth import get_current_user

router = APIRouter(prefix="/admin/guestbook", tags=["admin"], dependencies=[Depends(get_current_user)])


class HiddenIn(BaseModel):
    hidden: bool


def make_router(db):
    @router.get("")
    async def list_all(page: int = Query(1, ge=1), size: int = Query(20, ge=1, le=100), filter: str = Query("all")):
        q = {} if filter == "all" else {"hidden": filter == "hidden"}
        total = await db.guestbook.count_documents(q)
        hidden = await db.guestbook.count_documents({"hidden": True})
        docs = await db.guestbook.find(q, {"_id": 0}).sort("created_at", -1).skip((page - 1) * size).limit(size).to_list(size)
        return {"total": total, "hidden": hidden, "page": page, "size": size, "items": docs}

    @router.patch("/{entry_id}")
    async def set_hidden(entry_id: str, payload: HiddenIn):
        r = await db.guestbook.update_one({"id": entry_id}, {"$set": {"hidden": payload.hidden}})
        if r.matched_count == 0:
            raise HTTPException(status_code=404, detail="Firma no encontrada")
        return {"id": entry_id, "hidden": payload.hidden}

    @router.delete("/{entry_id}")
    async def delete_entry(entry_id: str):
        r = await db.guestbook.delete_one({"id": entry_id})
        if r.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Firma no encontrada")
        return {"id": entry_id, "deleted": True}

    return router
