import express from 'express';
import {runAsyncWrapper} from "../../utils/asyncMiddleware.js";
import {createMenuItem, getMenuItem, deleteMenuItem, updateMenuItem} from "./controller.js";
import {imageUploader} from '../../utils/multerService.js';

const menuItemRouter = new express.Router();

menuItemRouter.post('/', imageUploader(), runAsyncWrapper(createMenuItem));
menuItemRouter.put('/:menuItemId', imageUploader(), runAsyncWrapper(updateMenuItem));
menuItemRouter.get('/', runAsyncWrapper(getMenuItem));
menuItemRouter.delete('/:menuItemId', runAsyncWrapper(deleteMenuItem));

export default menuItemRouter
