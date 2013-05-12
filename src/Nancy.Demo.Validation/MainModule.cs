﻿namespace Nancy.Demo.Validation
{
    using System.Linq;
    using Nancy.Demo.Validation.Database;

    public class MainModule : NancyModule
    {
        public MainModule()
        {
            Get["/"] = x =>
                {
                    return "<a href='/customers'>Customers</a><br><a href='/products'>Products</a><br /><a href='/orders'>Orders</a>";
                };
        }
    }
}