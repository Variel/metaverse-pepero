using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;

namespace GiveMePepero
{
    public static class Crypto
    {
        const int IterationCount = 1000;
        const int SaltSize = 128;
        const int SubkeySize = 256;

        public static string HashPassword(string password)
        {
            var salt = new byte[SaltSize / 8];

            using (var generator = RandomNumberGenerator.Create())
            {
                generator.GetBytes(salt);
            }
            return Convert.ToBase64String(GenerateSubkey(password, salt));
        }

        public static bool VerifyHashedPassword(string hashedPassword, string password)
        {
            var bytes = Convert.FromBase64String(hashedPassword);
            var salt = bytes.Skip(1).Take(SaltSize / 8).ToArray();

            return hashedPassword == Convert.ToBase64String(GenerateSubkey(password, salt));
        }

        private static byte[] GenerateSubkey(string password, byte[] salt)
        {
            var subkey = KeyDerivation.Pbkdf2(password, salt, KeyDerivationPrf.HMACSHA512, IterationCount, SubkeySize / 8);

            using var ms = new MemoryStream();
            ms.WriteByte(0);
            ms.Write(salt, 0, salt.Length);
            ms.Write(subkey, 0, subkey.Length);

            return ms.ToArray();
        }
    }
}
