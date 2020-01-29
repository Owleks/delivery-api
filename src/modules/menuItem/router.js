import express from 'express';
import {runAsyncWrapper} from "../../utils/asyncMiddleware.js";
import {createMenuItem, getMenuItem, deleteMenuItem, updateMenuItem} from "./controller.js";

const menuItemRouter = new express.Router();

menuItemRouter.post('/', runAsyncWrapper(createMenuItem));
menuItemRouter.put('/:id', runAsyncWrapper(updateMenuItem));
menuItemRouter.get('/', runAsyncWrapper(getMenuItem));
menuItemRouter.delete('/:id', runAsyncWrapper(deleteMenuItem));

export default menuItemRouter
