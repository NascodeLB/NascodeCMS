using Microsoft.VisualBasic; 
using System.Text; 

namespace NascodeCMS.Classes
{
    public class RandomKeyGenerator
    { 
        public string Generate(string Key_Letters, string Key_Numbers, int Key_Chars)
        { 
            char[] LettersArray;
            char[] NumbersArray;

            int i_key;
            float Random1;
            Int16 arrIndex;
            StringBuilder sb = new StringBuilder();
            char RandomLetter;
             
            LettersArray = Key_Letters.ToCharArray();
            NumbersArray = Key_Numbers.ToCharArray();

            for (i_key = 1; i_key <= Key_Chars; i_key++)
            { 
                VBMath.Randomize();
                Random1 = VBMath.Rnd();
                arrIndex = -1; 
                if ((System.Convert.ToInt32(Random1 * 111)) % 2 == 0 & LettersArray.Length > 0)
                { 

                    while (arrIndex < 0)
                        arrIndex = System.Convert.ToInt16(LettersArray.GetUpperBound(0) * Random1);
                    RandomLetter = LettersArray[arrIndex]; 
                    if ((System.Convert.ToInt32(arrIndex * Random1 * 99)) % 2 != 0)
                    {
                        RandomLetter = LettersArray[arrIndex];
                        sb.Append(RandomLetter.ToString().ToUpper());
                    }
                    else
                    {
                        sb.Append(RandomLetter.ToString());
                    }
                    
                }
                else
                { 
                    while (arrIndex < 0)
                        arrIndex = System.Convert.ToInt16(NumbersArray.GetUpperBound(0) * Random1);
                    sb.Append(NumbersArray[arrIndex]);
                }
            }
            return sb.ToString();
        }

    }
}
