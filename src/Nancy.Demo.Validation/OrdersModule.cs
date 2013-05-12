namespace Nancy.Demo.Validation
{
    using System.Linq;
    using ModelBinding;
    using Nancy.Validation;
    using Database;
    using Models;

    public class OrdersModule : NancyModule
    {
        public OrdersModule()
            : base("/orders")
        {
            Get["/"] = x =>
                { 
                    var model = DB.Orders.OrderBy(e => e.Value).ToArray();

                    return View["Orders", model];
                };

            Post["/"] = x =>
                {
                    Order model = this.Bind();
                    var result = this.Validate(model);
                    if (!result.IsValid)
                    {
                        return View["OrderError", result];
                    }

                    DB.Orders.Add(model);
                    return this.Response.AsRedirect("/Orders");
                };
        }
    }
}