const { NotFoundError } = require('../common/responses/errorReponse');
const CategoryModel = require('../models/category.model')
const { default: slugify } = require("slugify");
const CategoryRepository = require('../models/repos/category.reppo')
const {formatPaginatedResponse} = require('../helpers/responseFormat')

class CategoryService {
    static create = async ({ name, description }) => {
        const existing = await CategoryRepository.findByName(name);
        if (existing) {
          throw new Error('Category with this name already exists');
        }
            
        const newCategory = await CategoryRepository.create({
          name,
          description
        });
      
        return newCategory;
    };

    static getPaginatedCategories = async ({ page, limit, status, query }) => {
        const filter = {};
        if (status && status !== 'ALL') {
          filter.status = status;
        }
      
        if (query) {
          filter.name = { $regex: query, $options: 'i' };
        }
      
        const skip = (page - 1) * limit;
      
        const [data, total] = await Promise.all([
          CategoryRepository.findManyWithFilter(filter, skip, limit),
          CategoryRepository.countWithFilter(filter)
        ]);
      
        return formatPaginatedResponse({ metadata: data, page, limit, total });
    };

    static getAllCategoriesPublic = async() => {
      console.log('-category:::getAll')
      return await CategoryModel.find({ status: 'ACTIVE' }).select("name slug description")
    }

    static getBySlug = async (slug) => {
        const category = await CategoryRepository.findBySlug(slug)
        if (!category) {
            throw new NotFoundError("Not found")
        }
        return category
    }


    static updateCategory = async (categoryId, payload) => {
      const existingCategory = await CategoryRepository.findById(categoryId);
      if (!existingCategory) {
        throw new Error("Category not found");
      }
      const { name, description, status } = payload;
    
      if (name && name !== existingCategory.name) {
        const existed = await CategoryRepository.findByName(name);
        if (existed && existed._id.toString() !== categoryId.toString()) {
          throw new Error("Category name already exists");
        }
        existingCategory.name = name; 
      }
    
      if (description !== undefined) {
        existingCategory.description = description;
      }
    
      if (status !== undefined) {
        existingCategory.status = status;
      }
    
      await existingCategory.save();
      return existingCategory;
  };

  static getCategoryDetail = async (categoryId) => {
    const category = await CategoryRepository.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    return category;
  };
}

module.exports = CategoryService