import express from 'express';

import {createMenu, deleteMenu, getMenus, updateMenu} from "./controller.js";
import {runAsyncWrapper} from "../../utils/asyncMiddleware.js";
import {imageUploader} from '../../utils/multerService.js';

const menuRouter = new express.Router();

menuRouter.post('/', imageUploader(), runAsyncWrapper(createMenu));
menuRouter.put('/:menuId', imageUploader(), runAsyncWrapper(updateMenu));
menuRouter.get('/', runAsyncWrapper(getMenus));

// todo: remove all menu items from deleted menu as well
menuRouter.delete('/:menuId', runAsyncWrapper(deleteMenu));

export default menuRouter;