import { Request, Response } from "express";
import UserRepository from "../repositories/UserRepository";
import { CreateUserDTO } from "../models/dto/createUserDTO";
import validateModel from "../utils/validateModel";
import { HttpException } from "../models/httpException";
import { HttpStatus } from "../utils/constants/httpStatus";
import { VisibleUser } from "../models/visibleUser";
import { LoginDTO } from "../models/dto/loginDTO";
import BCryptHelper from "../utils/helpers/BCryptHelper";
import TokenHelper from "../utils/helpers/TokenHelper";
import SignedUrlRepository from "../repositories/SignedUrlRepository";
import { UpdateUserDTO } from "../models/dto/updateUserDTO";
import { UserEntity } from "../entities/UserEntity";
import ModelHelper from "../utils/helpers/ModelHelper";

class UserController {

    async login(req: Request, res: Response) {
        const bodyUser = new LoginDTO(req.body);
        await validateModel(bodyUser);

        let user = await UserRepository.findByEmail(bodyUser.email);

        if (!user) {
            throw new HttpException("Usuário ou senha inválidos", HttpStatus.NOT_FOUND);
        }

        const passwordsMatch = await BCryptHelper.compare(bodyUser.password, user.password);

        if (!passwordsMatch) {
            throw new HttpException("Usuário ou senha inválidos", HttpStatus.NOT_FOUND);
        }

        const jwtUser = ModelHelper.getUserFromUserEntity(user);

        const { accessToken, refreshToken } = TokenHelper.getTokens(jwtUser);

        return res.json({
            user: jwtUser,
            accessToken,
            refreshToken,
        })

    }

    async create(req: Request, res: Response) {
        const bodyUser = new CreateUserDTO(req.body);
        await validateModel(bodyUser);

        let user = await UserRepository.findByEmail(bodyUser.email);

        if (user) {
            throw new HttpException("Usuário já cadastrado", HttpStatus.CONFLICT);
        }

        user = await UserRepository.create(bodyUser);

        const jwtUser = ModelHelper.getUserFromUserEntity(user);

        const { accessToken, refreshToken } = TokenHelper.getTokens(jwtUser);

        return res.json({
            user: jwtUser,
            accessToken,
            refreshToken,
        })
    }

    async refreshToken(req: Request, res: Response) {
        const userFromReq = req.user!;

        const user = await UserRepository.findByUUID(userFromReq.uuid);

        const jwtUser = ModelHelper.getUserFromUserEntity(user);

        const { accessToken, refreshToken } = TokenHelper.getTokens(jwtUser);

        return res.json({
            user: jwtUser,
            accessToken,
            refreshToken,
        })
    }

    async findUserByEmail(req: Request, res: Response) {
        const reqUser = req.user!;
        const { email: emailParam } = req.query;
        const email = emailParam as string;

        if (!email || !email.trim()) {
            throw new HttpException("Email é obrigatório", HttpStatus.BAD_REQUEST);
        }

        const users = await UserRepository.findByEmailWhereUUIDNot(reqUser.uuid, email);
        
        const formattedUsers: VisibleUser[] = users.map(user => ModelHelper.getUserFromUserEntity(user));

        return res.json(formattedUsers);
    }

    async changeAvatar(req: Request, res: Response) {
        const reqUser = req.user!;
        const { signedUrlUUID } = req.body;
        if (!signedUrlUUID) {
            throw new HttpException("Imagem obrigatória.", HttpStatus.BAD_REQUEST);
        }

        const signedUrl = await SignedUrlRepository.findByUUID(signedUrlUUID);

        if (!signedUrl) {
            throw new HttpException("Imagem não encontrada.", HttpStatus.NOT_FOUND);
        }

        await UserRepository.updateAvatar(reqUser.uuid, signedUrl.url);

        return res.json(signedUrl.url);
    }

    async removeAvatar(req: Request, res: Response) {
        const reqUser = req.user!;

        await UserRepository.updateAvatar(reqUser.uuid, null);

        return res.send();
    }

    async updateUser(req: Request, res: Response) {
        const reqUser = req.user!;
        const updateUserDTO = new UpdateUserDTO(req.body);
        await validateModel(updateUserDTO);
        
        const user = await UserRepository.findByEmail(updateUserDTO.email);

        if (user && user.uuid !== reqUser.uuid) {
            throw new HttpException("Já existe uma conta cadastrada com o e-mail informado.", HttpStatus.CONFLICT);
        }

        const userEntity = await UserRepository.findByUUID(reqUser.uuid);

        await UserRepository.updateUserNameAndEmail(userEntity.id, updateUserDTO.name, updateUserDTO.email);

        const finalUser: VisibleUser = ModelHelper.getUserFromUserEntity(userEntity, {
            email: updateUserDTO.email,
            name: updateUserDTO.name,
        })

        return res.json(finalUser);
    }

    async getMyUser(req: Request, res: Response) {
        const reqUser = req.user!;
        
        const user = await UserRepository.findByUUID(reqUser.uuid);

        if (!user) {
            throw new HttpException("Usuário não encontrado", HttpStatus.NOT_FOUND);
        }

        const finalUser: VisibleUser = ModelHelper.getUserFromUserEntity(user);

        return res.json(finalUser);
    }

}

export default new UserController();