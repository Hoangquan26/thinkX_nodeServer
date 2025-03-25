const { pick } = require('lodash/fp')

const getInstanceData = ({object, key = []}) => {
    return pick(object, key)
    //_.pick(object, ['a', 'c']);
    // => { 'a': 1, 'c': 3 }
}

module.exports = {
    getInstanceData 
}