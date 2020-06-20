<template>
    <Tree :data="data" :render="renderContent" class="demo-tree-render" @on-select-change="onSelectChange"></Tree>
</template>
<script>
import EditableSpan from "./EditableSpan"
export default {
    data() {
        return {
            data: [
                {
                    title: "",
                    expand: true,
                    disabled:true,
                    render: (h, { root, node, data }) => {
                        root, node;
                        return h(
                            "span",
                            {
                                style: {
                                    display: "inline-block",
                                    width: "100%"
                                },
                                class: "nohover"
                            },
                            [
                                h("span", [
                                    h("Icon", {
                                        props: {
                                            type: "ios-folder-outline"
                                        },
                                        style: {
                                            marginRight: "8px"
                                        }
                                    }),
                                    h("span", data.title),

                                    h("Icon", {
                                        props: {
                                            type: "ios-add"
                                        },
                                        style: {
                                            marginRight: "8px"
                                        },
                                        on: {
                                            click: () => this.$emit("new-file")
                                        }
                                    })
                                ])
                            ]
                        );
                    },
                    children: this.children(),
                }
            ],
            buttonProps: {
                type: "default",
                size: "small"
            }
        };
    },
    model: {
        prop: 'activeFile',
        event: 'change'
    },
    props: ["files", "activeFile"],
    watch: {
        files(){
            this.$set(this.data[0], "children", this.children());
        },
        activeFile(){
            this.data[0].children.map(
                child=>{
                    if(child.id == this.activeFile)
                        child.selected = true;
                    else if(child.selected)
                        child.selected = false;
                }
            )
        }
    },
    methods: {
        children(){
            let children = [];
            for(let id in this.files)
                children.push({title:this.files[id].name, id:id, selected:id==this.activeFile});
            return children;
        },
        renderContent(h, { root, node, data }) {
            root, node;
            return h(
                "span",
                {
                    style: {
                        display: "inline-block",
                        width: "100%"
                    }
                },
                [
                    h("span", [
                        h("Icon", {
                            props: {
                                type: "ios-paper-outline"
                            },
                            style: {
                                marginRight: "8px"
                            }
                        }),
                        h(EditableSpan, {
                            props: {
                                name:data.title,
                            },
                            on:{
                                rename:newname=>{
                                    this.$emit("rename", data.id, newname);
                                }
                            }
                        })
                    ])
                ]
            );
        },
        append(data) {
            const children = data.children || [];
            children.push({
                title: "new.sol",
                expand: true
            });
            this.$set(data, "children", children);
        },
        remove(root, node, data) {
            const parentKey = root.find(el => el === node).parent;
            const parent = root.find(el => el.nodeKey === parentKey).node;
            const index = parent.children.indexOf(data);
            parent.children.splice(index, 1);
        },
        onSelectChange(a, b){
            b.selected = true;
            if(this.activeFile != b.id)
                this.$emit('change', b.id)
        }
    }
};
</script>
<style>
.demo-tree-render .ivu-tree-title {
    color: azure;
    width: 100%;
    /*margin-right: 5em;*/
    margin:0;
    padding: 0;
}
.demo-tree-render .ivu-tree-title-selected {
    background-color: #808695;
}

.demo-tree-render .ivu-tree-title:not(.nohover):hover {
    background-color: #808695;
}
</style>
