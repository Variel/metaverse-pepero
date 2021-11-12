using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GiveMePepero.Models.Response
{
    public class PeperoResponseModel
    {
        public string Id { get; set; }

        public string Message { get; set; }

        public string PackageImage { get; set; }
        public string PeperoImage { get; set; }

        public bool IsPrivate { get; set; }

        public string GiverName { get; set; }

        public DateTimeOffset CreatedAt { get; set; }
    }
}
