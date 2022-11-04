﻿// <auto-generated />
using System;
using GiveMePepero.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace GiveMePepero.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.10")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("GiveMePepero.Models.Pepero", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<DateTimeOffset>("CreatedAt")
                        .HasColumnType("datetimeoffset");

                    b.Property<string>("GiverId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("GiverName")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("bit");

                    b.Property<string>("Message")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PackageImage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PeperoImage")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ReceiverId")
                        .HasColumnType("nvarchar(450)");

                    b.Property<short>("Year")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("smallint")
                        .HasDefaultValue((short)2021);

                    b.HasKey("Id");

                    b.HasIndex("GiverId");

                    b.HasIndex("ReceiverId", "Year", "CreatedAt");

                    b.ToTable("Peperos");
                });

            modelBuilder.Entity("GiveMePepero.Models.PeperoUser", b =>
                {
                    b.Property<string>("Id")
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("Login")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("ProfilePicture")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("GiveMePepero.Models.Pepero", b =>
                {
                    b.HasOne("GiveMePepero.Models.PeperoUser", "Giver")
                        .WithMany("GivedPeperos")
                        .HasForeignKey("GiverId");

                    b.HasOne("GiveMePepero.Models.PeperoUser", "Receiver")
                        .WithMany("ReceivedPeperos")
                        .HasForeignKey("ReceiverId");

                    b.Navigation("Giver");

                    b.Navigation("Receiver");
                });

            modelBuilder.Entity("GiveMePepero.Models.PeperoUser", b =>
                {
                    b.Navigation("GivedPeperos");

                    b.Navigation("ReceivedPeperos");
                });
#pragma warning restore 612, 618
        }
    }
}
