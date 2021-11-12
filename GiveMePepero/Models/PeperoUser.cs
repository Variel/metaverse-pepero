using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GiveMePepero.Models
{
    public class PeperoUser
    {
        public string Id { get; set; } = Ulid.NewUlid().ToString().ToLower();

        public string Name { get; set; }
        public string ProfilePicture { get; set; }

        public string Login { get; set; }
        public string Password { get; set; }

        public ICollection<Pepero> ReceivedPeperos { get; set; } = new HashSet<Pepero>();
        public ICollection<Pepero> GivedPeperos { get; set; } = new HashSet<Pepero>();
    }
}
