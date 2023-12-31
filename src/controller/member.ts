// member controller implementation

import Member from "@/model/member";
import { Request, Response } from "express";
import mongoose from "mongoose";

// create member controller
export const addMemberController = async (req: Request, res: Response) => {
  try {
    // get member data from request body
    const { community, user, role } = req.body;

    // create member instance from member model
    const member = new Member({ community, user, role });

    // check if member already exists
    const existingMember = await Member.findOne({
      community,
      user,
      role,
    });

    if (existingMember) {
      return res.status(400).send({
        status: false,
        content: {
          error: "Member already exists",
        },
      });
    }

    // save member in database
    const savedMember = await member.save();

    // send success response
    return res.status(201).send({
      status: true,
      content: {
        data: savedMember,
      },
    });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).send({
        status: false,
        content: {
          error: "Member already exists",
        },
      });
    } else {
      return res.status(500).send({
        status: false,
        content: {
          error: error.message,
        },
      });
    }
  }
};

// remove member controller
export const removeMemberController = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.params;

    // check if id is valid
    if (!memberId || !mongoose.isValidObjectId(memberId)) {
      return res.status(400).send({
        status: false,
        content: {
          error: "Invalid member id",
        },
      });
    }

    // remove member from database
    await Member.findByIdAndRemove(memberId);

    // send success response
    return res.status(200).send({
      status: true,
    });
  } catch (error: any) {
    return res.status(500).send({
      status: false,
      content: {
        error: error.message,
      },
    });
  }
};
