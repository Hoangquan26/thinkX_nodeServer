const { convertObjectId } = require('../../utils/mongo');
const CategoryModel = require('../category.model');

const findById = async(id) => {
  id = convertObjectId(id)
  return await CategoryModel.findById(id)
}

const findBySlug = async (slug) => {
  return await CategoryModel.findOne({ slug, status: 'ACTIVE' }).select('name slug description')
}

const findManyWithFilter = async (filter, skip, limit) => {
  return await CategoryModel.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

const countWithFilter = async (filter) => {
  return await CategoryModel.countDocuments(filter);
};

const create = async (data) => {
  return await CategoryModel.create(data);
};

const findByName = async (name) => {
  return await CategoryModel.findOne({ name });
};

module.exports = {
  findBySlug,
  findManyWithFilter,
  countWithFilter,
  create,
  findByName,
  findById
}