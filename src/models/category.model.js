const mongoose = require('mongoose')
const slugify = require('slugify')

const DOCUMENT_NAME = 'category'
const COLLECTION_NAME = 'categories'

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'INACTIVE'],
    default: 'ACTIVE'
  }
}, {
  timestamps: true,
  collection: COLLECTION_NAME
})

CategorySchema.pre('validate', async function (next) {
  if (this.isModified('name') && !this.slug) {
    let baseSlug = slugify(this.name, { lower: true, strict: true });
    let uniqueSlug = baseSlug;
    let count = 1;

    const Category = mongoose.model(DOCUMENT_NAME);

    while (await Category.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${baseSlug}-${count++}`;
    }

    this.slug = uniqueSlug;
  }
  next();
});

module.exports = mongoose.model(DOCUMENT_NAME, CategorySchema)
