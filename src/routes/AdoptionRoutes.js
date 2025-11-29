import { Router } from "express";
import { registerDog_post, adoptDog_post, removedDog_delete, getDogs_get } from "../controllers/AdoptionController.js";

const adoptionRouter = Router();

adoptionRouter.post('/register', registerDog_post);
adoptionRouter.post('/adopt', adoptDog_post);
adoptionRouter.delete('/adopt', removedDog_delete);
adoptionRouter.get('/dogs', getDogs_get);

export default adoptionRouter;