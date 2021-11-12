using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GiveMePepero.Models.Request
{
    public class PostPeperoRequestModel
    {
        public string GiverName { get; set; }
        public string Message { get; set; }
        public bool IsPrivate { get; set; }
        public string PackageImage { get; set; }
        public string PeperoImage { get; set; }
    }
}
