class ApiResponse {
  constructor(statusCode, data, message = "Success", action = "unknown") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.action = action;

    // TODO: Uncomment the following line to spread the data object directly into the instance.
    // This allows accessing the data fields directly from the response object without having to go through response.data.
    // For example, instead of response.data.data, you can simply use response.user, response.posts, etc.
    // Object.assign(this, data);
  }
}

export { ApiResponse };
