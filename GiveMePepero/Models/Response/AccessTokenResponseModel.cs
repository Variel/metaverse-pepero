using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GiveMePepero.Models.Response
{
    public class AccessTokenResponseModel
    {
        public string AccessToken { get; set; }
        public string RefreshToken { get; set; }
        public DateTimeOffset Expires { get; set; }
        public DateTimeOffset RefreshExpires { get; set; }
    }
}
