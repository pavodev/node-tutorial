class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // 1A) Filtering
  filter() {
    // BUILD THE QUERY
    const queryObj = { ...this.queryString };
    const exludedFields = ['page', 'sort', 'limit', 'fields'];
    exludedFields.forEach((el) => delete queryObj[el]);

    // 1B) Advanced filtering

    // What we want: { difficulty: 'easy', duration: { $gte: 5 } }
    // What we get from the query: { difficulty: 'easy', duration: { gte: '5' } }
    // gte, gt, lte, lt

    let queryString = JSON.stringify(queryObj);

    /*
        ()    --> includes the operators
        '/b'  --> match the exact words (operators)
        '/g'  --> must happen multiple time (without the g, it replaces only the first occurence)
  
        The callback appends $ to the matched string
      */
    queryString = queryString.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`
    );

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  // 2) Sorting
  sort() {
    if (this.queryString.sort) {
      // if we want to sort by multiple fields, mongoose wants them separated by spase (for example 'price ratingsAverage name'). In http requests we can not add spaces in the query so we establish that the sort arguments must be separated by a comma: /tours/sort=price,ratingsAverage
      const sortBy = this.queryString.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  // 3) Field Limiting
  limitFields() {
    // only return request defined fields
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ');
      this.query = this.query.select(fields); // this is called 'projecting
    } else {
      // the minus excludes a field from the selection
      this.query = this.query.select('-__v');
    }

    return this;
  }

  // 4) Pagination
  paginate() {
    // page=2&limit=10 --> page 1: 1-10, page 2: 11-20, etc.
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
