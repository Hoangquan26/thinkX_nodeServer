const { pick } = require('lodash/fp')

const _ = require('lodash')

const getInstanceData = ({object, key = []}) => {
    console.log(object, key)
    return _.pick(object, key)
    //_.pick(object, ['a', 'c']);
    // => { 'a': 1, 'c': 3 }
}

module.exports = {
    getInstanceData 
}