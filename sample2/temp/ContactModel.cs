namespace sample2.temp
{
    public class ContactModel
    {
   
        public int Id { get; set; }
       
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int PhoneNumber { get; set; }
        public string Email { get; set; }
        public string Qualification { get; set; }




        public DateTime CreatedDate { get; set; } = DateTime.Now;

    }
}
