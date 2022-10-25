import * as bcrypt from "bcrypt";
import { Router, Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import UserWithThatEmailAlreadyExistsException from "../exceptions/UserWithThatEmailAlreadyExistsException";
import WrongCredentialsException from "../exceptions/WrongCredentialsException";
import HttpException from "../exceptions/HttpException";
import IController from "../interfaces/controller.interface";
import IDataStoredInToken from "../interfaces/dataStoredInToken";
import ITokenData from "../interfaces/tokenData.interface";
import validationMiddleware from "../middleware/validation.middleware";
import IUser from "../user/user.interface";
import userModel from "./../user/user.model";
import CreateUserDto from "../user/user.dto";
import LogInDto from "./logIn.dto";
import { OAuth2Client } from "google-auth-library";
import IGoogleUserInfo from "interfaces/googleUserInfo.interface";
import IRequestWithUser from "interfaces/requestWithUser.interface";

export default class AuthenticationController implements IController {
    public path = "/auth";
    public router = Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, validationMiddleware(CreateUserDto), this.registration);
        this.router.post(`${this.path}/login`, validationMiddleware(LogInDto), this.loggingIn);
        this.router.post(`${this.path}/silentlogin`, this.silentLogin);
        this.router.post(`${this.path}/logout`, this.loggingOut);
        this.router.post(`${this.path}/google`, this.loginAndRegisterWithGoogle);
    }

    private registration = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userData: IUser = req.body;
            if (await this.user.findOne({ email: userData.email })) {
                next(new UserWithThatEmailAlreadyExistsException(userData.email));
            } else {
                const hashedPassword = await bcrypt.hash(userData.password, 10);

                const user = await this.user.create({
                    ...userData,
                    password: hashedPassword,
                });
                user.password = undefined;
                const tokenData: ITokenData = this.createToken(user);
                res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                res.send(user);
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private silentLogin = async (req: IRequestWithUser, res: Response) => {
        const cookies = req.cookies;
        if (cookies && cookies.Authorization) {
            const secret = process.env.JWT_SECRET;
            const verificationResponse = jwt.verify(cookies.Authorization, secret) as IDataStoredInToken;
            if (verificationResponse && verificationResponse._id) {
                const id = verificationResponse._id;
                const user = await userModel.findById(id);
                if (user) {
                    res.send(user);
                }
            } else {
                res.sendStatus(404);
            }
        } else {
            res.sendStatus(404);
        }
    };

    private loggingIn = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const logInData: IUser = req.body;
            const user = await this.user.findOne({ email: logInData.email });
            if (user) {
                const isPasswordMatching = await bcrypt.compare(logInData.password, user.password);
                if (isPasswordMatching) {
                    user.password = undefined;
                    const tokenData = this.createToken(user);
                    res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                    res.send(user);
                } else {
                    next(new WrongCredentialsException());
                }
            } else {
                next(new WrongCredentialsException());
            }
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private loggingOut = (req: Request, res: Response) => {
        res.setHeader("Set-Cookie", ["Authorization=; SameSite=None; HttpOnly; Secure; Path=/; Max-age=0"]);
        res.sendStatus(200);
    };

    private loginAndRegisterWithGoogle = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const client: OAuth2Client = new OAuth2Client();
            const verifyToken = async (token: string) => {
                client.setCredentials({ access_token: token });
                const userinfo = await client.request({
                    url: "https://www.googleapis.com/oauth2/v3/userinfo",
                });
                return userinfo.data;
            };

            verifyToken(req.body.atoken)
                .then(userInfo => {
                    const googleUser = userInfo as IGoogleUserInfo;
                    this.user.findOne({ email: googleUser.email }).then(user => {
                        if (user) {
                            const tokenData = this.createToken(user);
                            res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                            res.send(user);
                        } else {
                            // Register as new Google user
                            this.user
                                .create({
                                    ...googleUser,
                                    password: "stored at Google",
                                    role_bits: 0,
                                })
                                .then(user => {
                                    const tokenData: ITokenData = this.createToken(user);
                                    res.setHeader("Set-Cookie", [this.createCookie(tokenData)]);
                                    res.send(user);
                                });
                        }
                    });
                })
                .catch(() => {
                    next(new WrongCredentialsException());
                });
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };

    private createCookie(tokenData: ITokenData) {
        return `Authorization=${tokenData.token}; SameSite=None; HttpOnly; Secure;  Path=/; Max-Age=${tokenData.expiresIn}`;
    }

    private createToken(user: IUser): ITokenData {
        const expiresIn = 24 * 60 * 60; // 1 day
        // const expiresIn = 30; // for test
        const secret = process.env.JWT_SECRET;
        const dataStoredInToken: IDataStoredInToken = {
            _id: user._id.toString(),
        };
        return {
            expiresIn,
            token: jwt.sign(dataStoredInToken, secret, { expiresIn }),
        };
    }
}
