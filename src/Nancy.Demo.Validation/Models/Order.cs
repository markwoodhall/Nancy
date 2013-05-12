namespace Nancy.Demo.Validation.Models
{

    using MFlow.Core.Validation;

    public class Order : ValidatedModel<Order>
    {
        public Order()
        {
            this.GetValidator(this)
                .Check(m => m.CustomerName).IsNotEmpty().Hint("Enter customer name")
                .And(m => m.Value).IsGreaterThan(100).Hint("Enter order value > 100")
                .When(w => w.Check(m => m.Value).IsGreaterThan(10000))
                .Check(m => m.CustomerName).IsEqualTo("Mr Rich").Message("When value is greater than 10000, Customer name should be Mr Rich");
        }

        public int Id { get; set; }
        public string CustomerName { get; set; }
        public int Value { get; set; }
    }
}