using NascodeCMS.Auth;
using System;

#nullable disable

namespace NascodeCMS.Models
{
    public partial class Member
    {
        public decimal ID { get; set; }
        public byte? PreferredLanguage { get; set; }
        public string AccountType { get; set; }
        public string FirebaseID { get; set; }
        public string FirebaseType { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public decimal? iaminCityID { get; set; }
        public byte? iaminCity_isVisible { get; set; }
        public string MobileNumber { get; set; }
        public decimal? MobileCountryID { get; set; }
        public DateTime? DOB { get; set; }
        public byte? DOB_isVisible { get; set; }
        public decimal? Height { get; set; }
        public decimal? HeightInchs { get; set; }
        public string HeightUnit { get; set; }
        public string Hometown { get; set; }
        public byte? Hometown_isVisible { get; set; }
        public string Voiceprompt { get; set; }
        public decimal? VoicepromptLength { get; set; }
        public string LiveIn { get; set; }
        public byte? LiveIn_isVisible { get; set; }
        public string Career { get; set; }
        public byte? Career_isVisible { get; set; }
        public string Education { get; set; }
        public byte? Education_isVisible { get; set; }
        public string VerificationKey { get; set; }
        public decimal? SelectedSkinID { get; set; }
        public decimal? AvailableNumberOfCoins { get; set; }
        public decimal? AvailableNumberOfUndo { get; set; }
        public decimal? AvailableNumberOfRollDice { get; set; }
        public decimal? AvailableNumberOfGlobalShoutouts { get; set; }
        public decimal? AvailableNumberOfInClubShoutouts { get; set; }
        public decimal? AvailableNumberOfInTableShoutouts { get; set; }
        public decimal? AvailableNumberOfToMemberShoutouts { get; set; }
        public decimal? AvailableNumberOfSuperLikes { get; set; }
        public string CurrentLocationLong { get; set; }
        public string CurrentLocationLat { get; set; }
        public byte? GlobalMembersView { get; set; }
        public byte? MaximumDistance { get; set; }
        public byte? OnlyShowMembersInMaxDistance { get; set; }
        public byte? AgeRangeFrom { get; set; }
        public byte? AgeRangeTo { get; set; }
        public byte? MakeProfileHidden { get; set; }
        public byte? AllowNotificationPopups { get; set; }
        public byte? SendReadReceipt { get; set; }
        public byte? ShowActiveStatus { get; set; }
        public decimal? HeightUnitID { get; set; }
        public decimal? DistanceUnitID { get; set; }
        public byte? StopVoiceAutoplayInTable { get; set; }
        public byte? MusicVolum { get; set; }
        public byte? AppVolum { get; set; }
        public decimal? RankScore { get; set; }
        public byte? RequireFaceID { get; set; }
        public byte? RequireFingerPrintAccess { get; set; }
        public byte? LiveMatch { get; set; }
        public string WhereAreyouGoingTonight { get; set; }
        public DateTime? LastSeenDate { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string? ShortDescription { get; set; }
        public string? DeviceID { get; set; }
        public decimal? Coins { get; set; }
        public byte? SetupCompleted { get; set; }

        //public byte? AllowNotificationPopups { get; set; }
        public Int32 Rate { get; set; }

        public string? MemberPhoto { get; set; }
        public string? MemberStatus { get; set; }

        //used for clubchat
        public decimal? ClubID { get; set; }

        public string? Badge { get; set; }
        public string? ZodiacSign { get; set; }
        public byte? AgeBelow18 { get; set; }
        public decimal? FolderID { get; set; } //used in promotions
        public string? LastStatus { get; set; }
        public string? LastScenePhase { get; set; }
        public Int32? FollowersCount { get; set; }
        public string? MusicStyle { get; set; }
        public string? Gender { get; set; }
        public decimal? GenderPreferenceRecordID { get; set; }
        public string? MatchStatus { get; set; }
        public string? DeviceType { get; set; }
        public string? ClubrID { get; set; }

        public Int32? haveInteraction { get; set; }
        public string? StripeCustomerId { get; set; }
        public Int32? isVip { get; set; }
        public Int32? bottlesNumber { get; set; }
    }

    public partial class MemberQueue
    {
        public decimal ID { get; set; }
        public byte? PreferredLanguage { get; set; } 
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }  
        public Int32 Rate { get; set; }

        public string? MemberPhoto { get; set; }
        public string? MemberStatus { get; set; }
         
        public string? Badge { get; set; } 
        public string? Gender { get; set; } 
        public string? LastScenePhase { get; set; }

        public Int32? ChatBefore { get; set; } // highlight users with no chat history
    }

    public partial class MemberMini
    {
        public decimal ID { get; set; }
        public byte? PreferredLanguage { get; set; } 
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Int32 Rate { get; set; }

        public string? MemberPhoto { get; set; }
        public string? MemberStatus { get; set; }

        public string? Badge { get; set; }
        public string? Gender { get; set; }
        public string? LastScenePhase { get; set; }
        public string? ZodiacSign { get; set; }
        public Int32? IsNearBy { get; set; }
    }
    public partial class MemberProMini
    {
        public decimal ID { get; set; }  
        public string FirstName { get; set; }
        public string LastName { get; set; } 
        public string? MemberPhoto { get; set; } 
        public string? LastScenePhase { get; set; } 
    
    }


    public partial class MemberFolder
    {
        public decimal ID { get; set; }
        public string? Title { get; set; } 
        public decimal? FolderID { get; set; }
        public string? FullName { get; set; }
        public string? MemberPhoto { get; set; }
        public string? Badge { get; set; } 
    }

        public partial class MemberTable
    {
        public decimal ID { get; set; }
    }




    public partial class TableOwner
    {
        public decimal ID { get; set; } //memberID
        public decimal? TableID { get; set; }
        public string Name { get; set; }//table name
        public Int32? MembersCount { get; set; }//table members count
        public byte? PreferredLanguage { get; set; }
        public string AccountType { get; set; }
        public string FirebaseID { get; set; }
        public string FirebaseType { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public decimal? iaminCityID { get; set; }
        public byte? iaminCity_isVisible { get; set; }
        public string MobileNumber { get; set; }
        public decimal? MobileCountryID { get; set; }
        public DateTime? DOB { get; set; }
        public byte? DOB_isVisible { get; set; }
        public decimal? Height { get; set; }
        public decimal? HeightInchs { get; set; }
        public string HeightUnit { get; set; }
        public string Hometown { get; set; }
        public byte? Hometown_isVisible { get; set; }
        public string Voiceprompt { get; set; }
        public decimal? VoicepromptLength { get; set; }
        public string LiveIn { get; set; }
        public byte? LiveIn_isVisible { get; set; }
        public string Career { get; set; }
        public byte? Career_isVisible { get; set; }
        public string Education { get; set; }
        public byte? Education_isVisible { get; set; }
        public string VerificationKey { get; set; }
        public decimal? SelectedSkinID { get; set; }
        public decimal? AvailableNumberOfUndo { get; set; }
        public decimal? AvailableNumberOfRollDice { get; set; }
        public decimal? AvailableNumberOfGlobalShoutouts { get; set; }
        public decimal? AvailableNumberOfInClubShoutouts { get; set; }
        public decimal? AvailableNumberOfInTableShoutouts { get; set; }
        public decimal? AvailableNumberOfToMemberShoutouts { get; set; }
        public decimal? AvailableNumberOfSuperLikes { get; set; }
        public string CurrentLocationLong { get; set; }
        public string CurrentLocationLat { get; set; }
        public byte? GlobalMembersView { get; set; }
        public byte? MaximumDistance { get; set; }
        public byte? OnlyShowMembersInMaxDistance { get; set; }
        public byte? AgeRangeFrom { get; set; }
        public byte? AgeRangeTo { get; set; }
        public byte? MakeProfileHidden { get; set; }
        public byte? SendReadReceipt { get; set; }
        public byte? ShowActiveStatus { get; set; }
        public decimal? HeightUnitID { get; set; }
        public decimal? DistanceUnitID { get; set; }
        public byte? StopVoiceAutoplayInTable { get; set; }
        public byte? MusicVolum { get; set; }
        public byte? AppVolum { get; set; }
        public decimal? RankScore { get; set; }
        public byte? RequireFaceID { get; set; }
        public byte? RequireFingerPrintAccess { get; set; }
        public byte? LiveMatch { get; set; }
        public string WhereAreyouGoingTonight { get; set; }
        public DateTime? LastSeenDate { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
        public string? ShortDescription { get; set; }
        public string? DeviceID { get; set; }
        public decimal? Coins { get; set; }
        public byte? SetupCompleted { get; set; }
        public byte? AllowNotificationPopups { get; set; }
        public Int32 Rate { get; set; }
        public string? MemberPhoto { get; set; }
        public string? LastStatus { get; set; }

        //used for clubchat
        public decimal? ClubID { get; set; }
    }

}