import React, {Component} from 'react'
import {Table, CustomInput, Input} from 'reactstrap'
import Axios from 'axios'
import { API_URL } from '../helpers'
import { Spinner } from 'reactstrap';
class ManagePost extends Component{
    state={
        addImageFileName : 'Select Image...',
        addImageFile : undefined,
        captionAdd: '',
        listPosts:[]
    }

    componentDidMount(){
        Axios.get(`${API_URL}/post/getPosts`)
        .then((res)=>{
            this.setState({listPosts: res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }



    onAddImageFileChange=(e)=>{
        // console.log(document.getElementById('addImagePost').files[0])
        // console.log(e.target.files[0])
        // var file = document.getElementById('addImagePost').files[0]
        var file = e.target.files[0]
        if(file){
            this.setState({addImageFileName: file.name, addImageFile : file})
        }else{
            this.setState({addImageFileName: 'Select Image...', addImageFile: undefined})
        }
    }

    onCaptionAddChange = (e) =>{
        console.log(e.target.value)
        if(e.target.value.length <=100){
            this.setState({captionAdd: e.target.value})
        }
    }

    onBtnAddPostClick=()=>{
        if(this.state.addImageFile){
            var formData = new FormData()
            var headers = {
                headers: { 'Content-Type': 'multipart/form-data'}
            }

            var data = {
                caption: this.state.captionAdd,
                userId: 1
            }

            formData.append('image', this.state.addImageFile) // 
            formData.append('data', JSON.stringify(data)) //di kirim ke req.body.data

            Axios.post(API_URL + '/post/addPost', formData, headers)
            .then((res)=>{
                console.log(res.data)
                this.setState({listPosts: res.data, addImageFileName: 'Select Image...', captionAdd: ''})
            }).catch((err)=>{
                console.log(err)
            })
        }else{
            alert('Image harus diisi')
        }
    }

    onBtnDeletePostClick=(id)=>{
        // alert(id)
        Axios.delete(`${API_URL}/post/deletePost/${id}`)
        .then((res)=>{
            this.setState({listPosts: res.data})
        }).catch((err)=>{
            console.log(err)
        })
    }

    renderListPosts=()=>{
        return this.state.listPosts.map((item)=>{
            return(
                <tr key={item.id}>
                    <td>{item.id}</td>
                    <td><img src={`${API_URL}/${item.image}`} alt={item.caption} width='100px'/></td>
                    <td>{item.caption}</td>
                    <td>{item.userId}</td>
                    <td><Input type='button' value='Edit' className='btn btn-primary'/></td>
                    <td><Input type='button' value='Delete' className='btn btn-danger' onClick={()=>this.onBtnDeletePostClick(item.id)}/></td>
                </tr>
            )
        })
    }

    render(){
        // if(this.state.listPosts.length=0){
        //     return (
        //         <div>
        //           <Spinner type="grow" color="primary" />
        //           <Spinner type="grow" color="secondary" />
        //           <Spinner type="grow" color="success" />
        //           <Spinner type="grow" color="danger" />
        //           <Spinner type="grow" color="warning" />
        //           <Spinner type="grow" color="info" />
        //           <Spinner type="grow" color="light" />
        //           <Spinner type="grow" color="dark" />
        //         </div>
        //       );
        // }
        return(
            <div className='container mt-5'>
                <center>
                    <h1>Manage Post</h1>
                    
                    <Table hover>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Image</th>
                                <th>Caption</th>
                                <th>User Id</th>
                                <th colSpan='2'>Action</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.renderListPosts()}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td/>
                                <td>
                                    <CustomInput id='addImagePost' type='file' label={this.state.addImageFileName} onChange={this.onAddImageFileChange}/>
                                </td>
                                <td>
                                    <Input type='textarea' value={this.state.captionAdd} onChange={this.onCaptionAddChange}/>
                                    {/* <textarea value={this.state.captionAdd} onChange={this.onCaptionAddChange}></textarea> */}
                                </td>
                                <td/>
                                <td><Input type='button' value='Add' className='btn btn-success' onClick={this.onBtnAddPostClick}/></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </Table>
                </center>
            </div>
        )
    }
}

export default ManagePost;