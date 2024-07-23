class ApiResponse {
  constructor(
    statusCode,
    data,
    message = "Success",
    userActivityType = "unknown"
  ) {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
    this.userActivityType = userActivityType;
  }
}

export { ApiResponse };
