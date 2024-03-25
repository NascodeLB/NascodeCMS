 

import { formatDate } from "@angular/common" 
import { replace } from "lodash"
type Byte = number;
//@Injectable() 
export class AppConsts {

  //// local 
  public static RemoteServiceURL = "https://localhost:7000/"




  public static DynamicImagesPath: string = AppConsts.RemoteServiceURL + "DynamicImages/PagesImages/"
  public static DynamicImagesPath2: string = AppConsts.RemoteServiceURL + "DynamicImages/"
  public static DynamicFilesPath: string = AppConsts.RemoteServiceURL + "DynamicFiles/"

  public static CheckIfMobile() {
    var isMobile = false;
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
      || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
      isMobile = true;
    }
    return isMobile;
  }


  public static fixDate(date1: Date) {
    let hoursDiff = date1.getHours() - date1.getTimezoneOffset() / 60;
    let minutesDiff = (date1.getHours() - date1.getTimezoneOffset()) % 60;
    date1.setHours(hoursDiff);
    date1.setMinutes(minutesDiff);
    return date1;
  }


  public static checkDate(strDate: string, frontendLang: number) {
    if (strDate.trim() != '') {
      if (frontendLang == 3) {
        var myDate = new Date(strDate);
        var dateString = myDate.toLocaleDateString('ar-LB', { year: 'numeric', month: 'long', day: 'numeric' });
        return dateString;
      }
      else {
        var myDate = new Date(strDate);
        var dateString = formatDate(myDate, 'MMM dd, yyyy', 'en-US');
        return dateString;
      }
    }
    else {
      return '';
    }
  }

  public static getCufexURL(myRouteName: string) {

    if (myRouteName != undefined) {
      console.log("mm1" + ' ' + myRouteName);
      var mypath: string = AppConsts.sAppPath();
      mypath = mypath.replace("http://", "");
      mypath = mypath.replace("https://", "");
      mypath = mypath.replace("www.", "");

      myRouteName = myRouteName.replace("http://", "");
      myRouteName = myRouteName.replace("https://", "");
      myRouteName = myRouteName.replace("www.", "");

      myRouteName = myRouteName.replace(mypath + "cufex/", "");
      myRouteName = myRouteName.replace("cufex-", "");
      if (myRouteName.indexOf("/") > 0) {
        myRouteName = myRouteName?.substring(0, myRouteName.indexOf("/"))
      }
      myRouteName = myRouteName.replace("-details", "")
      if (myRouteName.indexOf("survey") != -1) { myRouteName = "survey"; }
    }
    else {
      myRouteName = "";
    }

    if (myRouteName == "no-right") myRouteName = "";
    if (myRouteName == "login") myRouteName = "";
    if (myRouteName == "home") myRouteName = "";
    if (myRouteName == "websettings") myRouteName = "";
    if (myRouteName == "career-opening") myRouteName = "";

    console.log("mm2" + ' ' + myRouteName);
    return myRouteName;
  }

  public static sAppPath(): string {
    var myAppPath: string = document.location.protocol + '//' + window.location.host;
    if (myAppPath.substr(myAppPath.length - 1) != '/') myAppPath = myAppPath + "/";

    console.log('app-path:' + myAppPath);
    // #michel // test this online before remove it
    //myAppPath = AppConsts.sAppPath1;
    return myAppPath;
  }


  public static StripHTML(source: string) {
    try {

      var result: string;

      // Remove HTML Development formatting
      //replace line breaks with space
      //because browsers inserts space
      result = source.replace(/\r?\n|\r/g, " ");
      //Remove step-formatting 
      //Remove repeating spaces because browsers ignore them
      result = replace(result, "( )+", " ");

      //Remove the header (prepare first by clearing attributes)
      result = replace(result, "<( )*head([^>])*>", "<head>");
      result = replace(result, "(<( )*(/)( )*head( )*>)", "</head>");
      result = replace(result, "(<head>).*(</head>)", "");

      //remove all scripts (prepare first by clearing attributes)
      result = replace(result, "<( )*script([^>])*>", "<script>");
      result = replace(result, "(<( )*(/)( )*script( )*>)", "</script>");
      //        @"(<script>)([^(<script>\.</script>)])*(</script>)",
      //        "",
      //        System.Text.RegularExpressions.RegexOptions.IgnoreCase);
      result = replace(result, "(<script>).*(</script>)", "");

      //remove all styles (prepare first by clearing attributes)
      result = replace(result, "<( )*style([^>])*>", "<style>");
      result = replace(result, "(<( )*(/)( )*style( )*>)", "</style>");
      result = replace(result, "(<style>).*(</style>)", "");

      //insert tabs in spaces of <td> tags
      result = replace(result, "<( )*td([^>])*>", "");

      //insert line breaks in places of <br /> and <LI> tags
      result = replace(result, "<( )*br( )*>", "");
      result = replace(result, "<( )*li( )*>", "");

      //insert line paragraphs (double line breaks) in place
      //if <P>, <DIV> and <TR> tags
      result = replace(result, "<( )*div([^>])*>", "");
      result = replace(result, "<( )*tr([^>])*>", "");
      result = replace(result, "<( )*p([^>])*>", "");

      //Remove remaining tags like <a>, links, images,
      //comments etc - anything that's enclosed inside<>
      result = replace(result, "<[^>]*>", "")

      //replace special characters:
      result = replace(result, " ", " ")

      result = replace(result, "&bull;", " * ")
      result = replace(result, "&lsaquo;", "<")
      result = replace(result, "&rsaquo;", ">")

      result = replace(result, "&nbsp;", " ")

      result = replace(result, "&trade;", "(tm)")
      result = replace(result, "&frasl;", "/")
      result = replace(result, "&lt;", "<")
      result = replace(result, "&gt;", ">")
      result = replace(result, "&copy;", "(c)")
      result = replace(result, "&reg;", "(r)")
      //Remove all others. More can be added, see
      //http://hotwired.lycos.com/webmonkey/reference/special_characters/
      result = replace(result, "&(.{2,6});", "")

      return result;
    }
    catch (e) {
      return source;

    }

  }

  public static fixMySeo(strWithHtml: string, iLength?: number) {
    var str: string = strWithHtml;
    //  str = tb.ConvertString(strWithHtml, Convert.ToString)
    //  str = StripHTML(str)
    //  str = tb.ConvertString(str, Convert.ToHTML)

    //  If Len(str) > iLength And iLength > 0 Then
    //str = Left(str, iLength)
    //Dim iLastSpaceIndex As Integer = str.LastIndexOf(" ")
    //If iLastSpaceIndex > 0 Then
    //str = str.Substring(0, iLastSpaceIndex)
    //End If

    //End If
    return str;
  }






  public static seoMarch2022(Type: string, MyString: string, BrowseSEOstring: string, AddStatic?: boolean) {
    if (AddStatic == undefined) AddStatic = true;
    if (BrowseSEOstring.trim() != "") MyString = BrowseSEOstring.trim();
    if (MyString == null) return "";
    if (MyString.trim() == "") return MyString;


    var StaticTitle: string = "";
    var StaticDesc: string = "";
    var StaticKeywords: string = "";
    if (AddStatic != undefined) {
      if (AddStatic == true) {
        StaticTitle = "";
        StaticKeywords = "";
      }
    }

    var str: string = AppConsts.StripHTML(MyString);
    if (Type.toLowerCase() == "title") {
      str = AppConsts.fixMySeo(str, 54) + StaticTitle;
    }

    if (Type.toLowerCase() == "description") {
      str += StaticDesc;
      str = AppConsts.fixMySeo(str, 300);
    }

    if (Type.toLowerCase() == "keyword") {
      str = StaticKeywords + str;
      str = str.substring(0, 250);

      str = replace(str, " the ", " ");
      str = replace(str, " in ", " ");
      str = replace(str, " to ", " ");
      str = replace(str, " and ", " ");
      str = replace(str, " or ", " ");
      str = replace(str, " on ", " ");
      str = replace(str, " for ", " ");
      str = replace(str, " into ", " ");
      str = replace(str, " is ", " ");
      str = replace(str, " are ", " ");
      str = replace(str, " they ", " ");
      str = replace(str, " it ", " ");
      str = replace(str, " her ", " ");
      str = replace(str, " his ", " ");
      str = replace(str, " their ", " ");
      str = replace(str, " all ", " ");
      str = replace(str, " a ", " ");
      str = replace(str, " with ", " ");
      str = replace(str, " your ", " ");
      str = replace(str, " i ", " ");
      str = replace(str, " be ", " ");
      str = replace(str, " where ", " ");
      str = replace(str, " were ", " ");
      str = replace(str, " who ", " ");
      str = replace(str, " whom ", " ");
      str = replace(str, " it's ", " ");
      str = replace(str, " will ", " ");
      str = replace(str, " my ", " ");
      str = replace(str, " we ", " ");
      str = replace(str, " you ", " ");
      str = replace(str, " u ", " ");
      str = replace(str, " our ", " ");
      str = replace(str, " them ", " ");
      str = replace(str, " there ", " ");
      str = replace(str, " here ", " ");
      str = replace(str, " out ", " ");
      str = replace(str, " in ", " ");
      str = replace(str, " for ", " ");
      str = replace(str, " a ", " ");
      str = replace(str, "~", " ");
      str = replace(str, "@", " ");
      str = replace(str, "#", " ");
      str = replace(str, "$", " ");
      str = replace(str, "%", " ");
      str = replace(str, "^", " ");
      str = replace(str, "&", " ");
      str = replace(str, "*", " ");
      str = replace(str, "(", " ");
      str = replace(str, ")", " ");
      str = replace(str, "_", " ");
      str = replace(str, "-", " ");
      str = replace(str, "+", " ");
      str = replace(str, "=", " ");
      str = replace(str, "{", " ");
      str = replace(str, "}", " ");
      //str = replace(str, '\', ' ');
      str = replace(str, "|", " ");
      str = replace(str, ".", " ");
      str = replace(str, "<", " ");
      str = replace(str, ">", " ");
      str = replace(str, "?", " ");
      str = replace(str, "/", " ");
      str = replace(str, "'", " ");
      str = replace(str, '"', ' ');
      str = replace(str, ":", " ");
      str = replace(str, ";", " ");
      str = replace(str, "`", " ");
      str = replace(str, "[", " ");
      str = replace(str, "]", " ");
      str = replace(str, "1", " ");
      str = replace(str, "2", " ");
      str = replace(str, "3", " ");
      str = replace(str, "4", " ");
      str = replace(str, "5", " ");
      str = replace(str, "6", " ");
      str = replace(str, "7", " ");
      str = replace(str, "8", " ");
      str = replace(str, "9", " ");
      str = replace(str, "0", " ");
      str = replace(str, " و ", " ");
      str = replace(str, " هي ", " ");
      str = replace(str, " هو ", " ");
      str = replace(str, " أن ", " ");
      str = replace(str, " مع ", " ");
      str = replace(str, " في ", " ");
      str = replace(str, " على", " ");
      str = replace(str, " من ", " ");
      str = replace(str, " هذا ", " ");
      str = replace(str, " هذه ", " ");
      str = replace(str, " ليتم ", " ");
      str = replace(str, " عبر ", " ");
      str = replace(str, " كل ", " ");
      str = replace(str, " ولكل ", " ");
      str = replace(str, " لكل ", " ");
      str = replace(str, " كل ", " ");
      str = replace(str, " إلى ", " ");
      str = replace(str, " أو ", " ");
      str = replace(str, " التي ", " ");
      str = replace(str, " بهم ", " ");
      str = replace(str, " بعد ", " ");
      str = replace(str, " لقد ", " ");
      str = replace(str, " قد ", " ");

      if (BrowseSEOstring == "") str = replace(str, " ", ",");
      var ComaNotCorrect: boolean = true;
      var mycount: Byte = 0;

      do {
        mycount += 1;
        str = replace(str, ",,", ",");
        if (str.includes(",,")) ComaNotCorrect = false;
        if (mycount > 10) break;
      } while (ComaNotCorrect === true || mycount > 10);

      ComaNotCorrect = true;
      mycount = 0;
      do {
        mycount += 1;
        str = replace(str, "،،", ",");
        if (str.includes("،،")) ComaNotCorrect = false;
        if (mycount > 10) break;
      } while (ComaNotCorrect === true || mycount > 10);

      if (str.trim() == "") return str;

      var indexNum: number = 0;
      str = replace(str, "،", ", ").toLowerCase();
      str = replace(str, ",", ", ").toLowerCase();
      if (str.indexOf(", ") == 0) str = str.substring(2, str.length - 2);
      for (var i = 1; i < 12; i++) {
        indexNum = str.indexOf(",", indexNum + 1);
        if (indexNum == -1) break;
      }
      if (indexNum != -1) str = str.substring(0, indexNum);
      str = str.toLowerCase();
    }
    return str;

  }

}
