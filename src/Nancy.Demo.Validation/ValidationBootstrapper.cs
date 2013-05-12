using Nancy.Conventions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Nancy.Demo.Validation
{
    public class ValidationBootstrapper : DefaultNancyBootstrapper
    {
        protected override void ConfigureConventions(NancyConventions nancyConventions)
        {
            nancyConventions.StaticContentsConventions.Add(StaticContentConventionBuilder.AddDirectory("Scripts", @"Scripts"));
            base.ConfigureConventions(nancyConventions);
        }
    }
}