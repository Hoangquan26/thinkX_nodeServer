'use strict'
const { CREATEDResponse, OKResponse } = require("../common/responses/successReponse");
const CategoryService = require("../services/category.service");

class CategoryController {
    static create = async(req, res, next) => {
        const { name, description} = req.body;
        const newCategory = await CategoryService.create({ name, description });
        new CREATEDResponse({
            message: 'Create new category successful',
            metadata: newCategory
        }).send(res)
    }

    static getCategoriesWithPagination = async(req, res, next) => {
        const { page = 1, limit = 10, status, query } = req.query;
        const result = await CategoryService.getPaginatedCategories({
          page: parseInt(page),
          limit: parseInt(limit),
          status,
          query
        });
        
        new OKResponse({
            message: 'Get all category successful',
            metadata: result
        }).send(res)
    }

    static getAllCategoriesPublic = async(req, res, next) => {
        const response = await CategoryService.getAllCategoriesPublic()
        new OKResponse({
            message: 'Get all category successful',
            metadata: response
        }).send(res)
    }

    static getCategoryBySlug = async(req, res, next) => {
        const { slug } = req.params

        const category = await CategoryService.getBySlug(slug)
        new OKResponse({
            message: 'Get all category successful',
            metadata: category
        }).send(res)
    }

    static updateCategory = async(req, res, next) => {
        const { id } = req.params;
        const payload = req.body;
      
        const updatedCategory = await CategoryService.updateCategory(id, payload);
        new OKResponse({
            message: 'Update category successful',
            metadata: updatedCategory
        }).send(res)
    }

    static getCategoryDetail = async(req, res, next) => {
        const { id } = req.params;
        const category = await CategoryService.getCategoryDetail(id);

        new OKResponse({
            message: 'Get category success',
            metadata: category
        }).send(res)
    }
}

module.exports = CategoryController