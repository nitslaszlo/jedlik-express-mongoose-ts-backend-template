import * as express from "express";
import Controller from "../interfaces/controller.interface";
import userModel from "../user/user.model";
import HttpException from "../exceptions/HttpException";

export default class ReportController implements Controller {
    public path = "/report";
    public router = express.Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.generateReport);
    }

    private generateReport = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            const usersByCities = await this.user.aggregate([
                {
                    $match: {
                        "address.city": {
                            $exists: true,
                        },
                    },
                },
                {
                    $group: {
                        _id: {
                            city: "$address.city",
                        },
                        users: {
                            $push: {
                                _id: "$_id",
                                name: "$name",
                            },
                        },
                        count: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $lookup: {
                        from: "posts",
                        localField: "users._id",
                        foreignField: "author",
                        as: "articles",
                    },
                },
                {
                    $addFields: {
                        amountOfArticles: {
                            $size: "$articles",
                        },
                    },
                },
                {
                    $sort: {
                        amountOfArticles: 1,
                    },
                },
            ]);
            response.send({
                usersByCities,
            });
            next();
        } catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
