from time import sleep
from baidutranslib import BaiduTranslator
from parse import compile
import pyttsx3

canTranslateLine = compile("  {}: '{}',")
voiceEngine = pyttsx3.init()
def speak(info: str) -> None:
    voiceEngine.say(info)
    voiceEngine.runAndWait()
    return

def transJs(lang: str, mode:str, translator: BaiduTranslator) -> list:
    retval = []
    # print(f"admin\\{lang}.js")
    fileExample = open(f"src\\i18n\\{mode}\\en-US.js", encoding = 'utf-8')
    for line in fileExample.readlines():
        line = line.replace('\n','')
        lineInfo = canTranslateLine.parse(line)
        if lineInfo != None:
            retval.append((lineInfo[0],lineInfo[1]))
            try:
                transRes = translator.translate(
                    lineInfo[1], to_language = lang
                )
                sleep(1)
            except translator.transError:
                speak('你就是歌姬吧')
                sleepCnt = 60
                flag = True
                while flag:
                    flag = False
                    sleep(sleepCnt)
                    try:
                        transRes = translator.translate(
                            lineInfo[1],to_language = lang
                        )
                    except translator.transError:
                        flag = True
                        sleepCnt += 60
            print(f'  {lineInfo[0]}: \'{transRes}\',')
            # sleep(3)
        else:
            print(line)  
    fileExample.close()
    return retval    

def main() -> int:
    translator = BaiduTranslator()
    lang = input("请输入要新增的语言: ")
    if not lang in translator.supportedLangCodes:
        print(f"{lang} 不是受支持的语言")
        print("受支持的语言有:")
        for supportedLang in translator.supportedLangCodes:
            print(supportedLang)
            return 1 # lang not supported
    transJs(lang,'admin',translator)
    transJs(lang,'oj',translator)
    return 0

if __name__ == '__main__':
    exit(main())