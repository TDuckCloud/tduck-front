export default {
    options(h, conf, key) {
        const list = []
        let style = 'height: 100%;'
        conf.__slot__.options.forEach(item => {
            list.push(<el-carousel-item style={'text-align: center;'}>
                <p>{item.label}</p>
                <el-image fit="contain" style={style} src={item.image}></el-image>
            </el-carousel-item>)
        })
        return list
    }
}
