<template>
  <div>
    <panel class="container">
      <div class="content markdown-body">
        <Row>
          <Col span="12" style="font-size:xx-large;">
            {{month}}月日历
          </Col>
          <Col span="6" style="font-size:xx-large;">晓风.jpg</Col>
          <Col span="6" style="font-size:xx-large;">晓华.jpg</Col>
        </Row> 
        <Calendar />
      </div>
    </panel>
  </div>
</template>
  
<script>
import Calendar from 'vue-calendar-component'

export default {
  name: 'CalenderDemo',
  components: {
    Calendar
  },
  data() {
    return {
      month: 1,
      daySum: 31,
      value: '2023-1-1'
    }
  },
  methods: {
    range(size) {
      var ret = []
      for (var i = 0; i < size; i++) {
        ret.push(i)
      }
      return ret
    }
  }
}
</script>
  
<style lang="less" scoped>
.container {
  margin-bottom: 20px;
  
  .content {
    font-size: 16px;
    margin: 0 50px 20px 50px;


    .headCol {
      text-align: center;
    }
  }
}
</style>
  