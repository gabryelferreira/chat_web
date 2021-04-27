import express from 'express';
import UserController from './controller/UserController';
import { refreshTokenMiddleware } from './middlewares/RefreshTokenMiddleware';
import { userMiddleware } from './middlewares/UserMiddleware';
import RoomController from './controller/RoomController';
import RoomMessageController from './controller/RoomMessageController';
import SignedUrlController from './controller/SignedUrlController';

const router = express.Router();

export default class Routes {
    
    get routes() {
        router.get("/", (req, res) => {
            res.json({
                success: true
            })
        })
        router.post("/login", UserController.login);

        router.post("/users", UserController.create);
        router.get("/users", userMiddleware, UserController.findUserByEmail);
        router.get("/users/me", userMiddleware, UserController.getMyUser);
        router.put("/users", userMiddleware, UserController.updateUser);
        router.put("/users/avatar", userMiddleware, UserController.changeAvatar);
        router.delete("/users/avatar", userMiddleware, UserController.removeAvatar);
        router.post("/refresh-token", refreshTokenMiddleware, UserController.refreshToken);

        router.get("/rooms", userMiddleware, RoomController.getAllChats);
        router.post("/rooms/privates/by-user/:uuid", userMiddleware, RoomController.getPrivateChatAndCreateIfNotExists);

        router.get("/rooms/:uuid/messages", userMiddleware, RoomMessageController.getChatMessages);

        router.get("/signed-url", userMiddleware, SignedUrlController.getSignedUrl);
        

        return router;
    }

}