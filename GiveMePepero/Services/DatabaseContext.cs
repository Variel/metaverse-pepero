using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GiveMePepero.Models;
using Microsoft.EntityFrameworkCore;

namespace GiveMePepero.Services
{
    public class DatabaseContext : DbContext
    {
        public DbSet<Pepero> Peperos { get; set; }
        public DbSet<PeperoUser> Users { get; set; }

        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Pepero>()
                .HasOne(p => p.Giver)
                .WithMany(u => u.GivedPeperos)
                .HasForeignKey(p => p.GiverId);

            modelBuilder.Entity<Pepero>()
                .HasOne(p => p.Receiver)
                .WithMany(u => u.ReceivedPeperos)
                .HasForeignKey(p => p.ReceiverId);

            modelBuilder.Entity<Pepero>()
                .Property(p => p.Year)
                .HasDefaultValue(2021);

            modelBuilder.Entity<Pepero>()
                .HasIndex(p => new { p.ReceiverId, p.Year, p.CreatedAt });

            base.OnModelCreating(modelBuilder);
        }
    }
}
