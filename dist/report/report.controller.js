import { Router } from "express";
import userModel from "../user/user.model";
import HttpException from "../exceptions/HttpException";
export default class ReportController {
    path = "/report";
    router = Router();
    user = userModel;
    constructor() {
        this.initializeRoutes();
    }
    initializeRoutes() {
        this.router.get(`${this.path}`, this.generateReport);
    }
    generateReport = async (req, res, next) => {
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
            res.send({
                usersByCities,
            });
            next();
        }
        catch (error) {
            next(new HttpException(400, error.message));
        }
    };
}
//# sourceMappingURL=report.controller.js.map