<template>
    <canvas ref="canvas" @click="draw" width="140" height="40" style="cursor: pointer;">
        </canvas>
</template>
<script lang="ts">
import { reactive, toRefs, onMounted, computed, watch, ref } from 'vue'
import { validateCodeTs } from '@/type/globalType'
export default {
    setup(props: any, context: any) {
        const data:validateCodeTs = reactive({
            codes: [],
            canvas: ref(),
            ctx: null,
            colors: ['red', 'yellow', 'blue', 'green', 'pink', 'black'],
            code_Len: 4
        })
        const codeString = computed(() => {
            let result = ''
            for (let i = 0; i < data.codes.length; i++) {
                result += data.codes[i]
            }
            return result.toUpperCase()
        })
        watch(
            codeString,
            function (newValue) {
                context.emit('change', newValue)
            }
        )
        onMounted(() => {
            draw()
        })
        const generateRandom = () => {
            data.codes = []
            const chars = 'abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
            const charsArr = chars.split('')

            for (let i = 0; i < data.code_Len; i++) {
                const num = Math.floor(Math.random() * charsArr.length)
                data.codes.push(charsArr[num])
            }
        }
        const draw = () => {
            generateRandom()
            drawText()
        }
        const drawLine = () => {
            if(!data.ctx) return
            const lineNumber = 3 // 线条条数
            const lineX = 140
            const lineY = 30 // 最大线条坐标
            for (let i = 0; i < lineNumber; i++) {
                data.ctx.strokeStyle = data.colors[Math.floor(Math.random() * 5)]
                data.ctx.beginPath()
                data.ctx.moveTo(
                    Math.floor(Math.random() * lineX),
                    Math.floor(Math.random() * lineY)
                )
                data.ctx.lineTo(
                    Math.floor(Math.random() * lineX),
                    Math.floor(Math.random() * lineY)
                )
                data.ctx.stroke()
            }
        }
        const drawText = () => {
            const canvas = data.canvas
            data.ctx = canvas.getContext('2d')
            if(!data.ctx) return
            data.ctx.fillStyle = '#BFEFFF'
            data.ctx.fillRect(0, 0, 140, 40)
            data.ctx.font = '20px Verdana'

            let x = 15

            for (let i = 0; i < data.code_Len; i++) {
                data.ctx.fillStyle = data.colors[Math.floor(Math.random() * 5)]
                data.ctx.fillText(data.codes[i], x, 25)
                x = x + 30
            }
            drawLine()
        }
        return {
            ...toRefs(data),
            codeString,
            draw
        }
    }

}
</script>
