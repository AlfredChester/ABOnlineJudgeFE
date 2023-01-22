<template>
  <panel class="container">
    <div slot="title" style="font-size: xx-large; margin-top: 3px;">
      {{ $t('m.ListeningPage') }}
    </div>
    <div class="content markdown-body">
      <span class="TermBox" v-for="term in audios">
        <h1>{{ term.titleName }}</h1>
        <div class="MusicPlayer">
          <aplayer 
            :music="term.Audiolist[0]" 
            :list="term.Audiolist" 
            :showlrc="false">
          </aplayer>
        </div>
      </span>
    </div>
  </panel>
</template>

<script>
  import aplayer from 'vue-aplayer'
  
  /**
   * A Function To generate A single Json by given params
   * @author Dr.Alfred
   *
   * @param {String} grade  current Grade
   * @param {*} index       Exercise Index or Exam Type
   * @param {*} whichExam   Which Exam, can be undefined
   */
  function generateJSON(grade, index, whichExam) {
    if (whichExam === undefined) {
      return {
        title: `练习${index}`,
        artist: '初中英语听力训练',
        src: require(`../../../../assets/Listenings/${grade}/Exercise ${index}.m4a`)
      }
    } else {
      return {
        title: `期${index}练习`,
        artist: '初中英语听力训练',
        src: require(`../../../../assets/Listenings/${grade}/${whichExam} Exam.m4a`)
      }
    }
  }

  /**
   * A Function to generate a list of Jsons of AudioInfos
   * @author Dr.Alfred
   *
   * @param {String} grade       current Grade
   * @param {Number} charpterNum Total sum of charpters
   * @param {Number} midTerm     Which Charpter is before Midterm
   */
  function getAudioByGrade(grade, charpterNum, midTerm) {
    let _retval = []            // 返回的JSON数组
    let givenMidTerm = false    // 是否已经把期中练习放入数组
    for (let i = 1; i < charpterNum; i++) {
      // 循环charpterNum - 1 次 填充除了期末练习之外的练习
      let index = i - 1
      if (i === midTerm + 1) {  // 期中考试
        _retval[index] = generateJSON(grade, '中', 'Mid-term') // 期中
        givenMidTerm = true     // 已经放了MidTerm Exam 所以 赋值为true
      } else {                  // 当前不是MidTerm whichExam就是undefined
        if (!givenMidTerm) {    // 没放MidTerm之前 就是Exercise i
          _retval[index] = generateJSON(grade, i)
        } else {                // 放了之后 就是Exercise i-1(index)
          _retval[index] = generateJSON(grade, index)
        }
      }
    }
    _retval[charpterNum - 1] = generateJSON(grade, '末', 'Final')   // 期末练习
    return _retval
  }

  /**
   * A function to generate Personalized Exercise Data
   * @param {String} grade    Grade
   * @param {Number} unit     Unit
   * @param {Number} exercise Exercise
   */
  function genPHData(grade, unit, exercise) {
    if (grade === undefined || unit === undefined || exercise === undefined) {
      return {
        error: 'Some problems has occured'
      }
    }
    return {
      title: `Unit ${unit} Exercise ${exercise}`,
      artist: '风华初级中学',
      src: require(`../../../../assets/Listenings/PH/${grade}/U${unit}E${exercise}.m4a`)
    }
  }

  /**
   * A function to generate "Exercise" Datas
   * @param {String} name   "Exercise" Name
   */
  function genExerciseData(name) {
    return {
      title: name,
      artist: '风华初级中学',
      src: require(`../../../../assets/Listenings/NormalExercise/${name}.m4a`)
    }
  }

  export default {
    name: 'Listening',
    components: {
      aplayer
    },
    data() {
      return {
        audios: [
          {
            titleName: '7A 听力书',
            Audiolist: getAudioByGrade('7A', 13, 6)
          },
          {
            titleName: '7A 个性化',
            Audiolist: [
              genPHData('7A', 2, 1),
              genPHData('7A', 4, 1)
            ]
          },
          {
            titleName: '小练习',
            Audiolist: [
              genExerciseData('上海市风华初级中学2022学年七年级第一学期国庆小练习听力'),
              genExerciseData('U5单元练习听力'),
              genExerciseData('7AU8单元测试听力音频'),
              genExerciseData('七年级-7A-期中模拟听力-1'),
              genExerciseData('七年级-7A-期中模拟听力-2'),
              genExerciseData('听力7a期中市北'),
              genExerciseData('Listening-Revision-1-for-Final-term')
            ]
          }
        ]
      }
    }
  }
</script>

<style scoped lang="less">
  .container {
    margin-bottom: 20px;
    .content {
      font-size: 16px;
      margin: 0 50px 20px 50px;
      .TermBox{
        .MusicPlayer{
          margin-bottom: 20px;
        }
        margin-bottom: 20px;
      }
    }
  }
</style>