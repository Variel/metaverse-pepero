using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GiveMePepero.Models
{
    public class Pepero
    {
        public string Id { get; set; } = Ulid.NewUlid().ToString().ToLower();

        public string Message { get; set; }

        public string PackageImage { get; set; }
        public string PeperoImage { get; set; }

        public bool IsPrivate { get; set; }

        public string GiverName { get; set; }
        public string GiverId { get; set; }
        public PeperoUser Giver { get; set; }

        public string ReceiverId { get; set; }
        public PeperoUser Receiver { get; set; }

        public short Year { get; set; }

        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.Now;
    }
}
