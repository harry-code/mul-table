import React, { useState, useEffect } from 'react';
import { Upload, Modal, message } from 'antd';
import { API_URL } from '~/service/request';
import { PlusOutlined } from '@ant-design/icons';

interface pageProps {
    getImgs?: any;
    imageList?: string;
    max?: number;
    size?: number;
}

export default function IndexPage({
    getImgs,
    imageList,
    max = 5,
    size = 10,
}: pageProps) {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | undefined>(undefined);
    const [previewTitle, setPreviewTitle] = useState(null);
    const [fileList, setFileList] = useState([]);

    // 监听传入的图片字符串
    useEffect(() => {
        if (imageList) {
            const new_imgList: any = imageList?.split(',').map((i: any) => {
                return {
                    uid: Math.random(),
                    name: 'image.png',
                    url: API_URL[process.env.NODE_ENV || 'production'] + i,
                    status: 'done',
                    response: {
                        code: 200,
                        rows: [i],
                    },
                };
            });
            setFileList(new_imgList);
        }
    }, [imageList]);

    const handleUploadImg = ({ fileList }: { fileList: any }) => {
        // 这里存在已上传的类型和正在上传的类型两种情况
        const filterList = fileList.filter((i: any) => {
            return i?.status === 'done' || i?.originFileObj?.size < size * 1024 * 1024
        });
        setFileList(filterList);
        getImgs(filterList.map((i: any) => i.response?.rows[0]));
    };

    const handleUploadRemove = (file: any) => { };

    const beforeUpload = (file: any): any => {
        if (fileList.length > max) {
            message.error(`最多只能上传${max}张图片`);
            return false;
        }
        const limit = file.size < size * 1024 * 1024;
        if (!limit) {
            message.error(`图片大于${size}MB，无法上传`);
            return false;
        }
    };

    const getBase64 = (file: any) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const handlePreview = async (file: any) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewVisible(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        );
        setPreviewImage(file.url || file.preview);
    };

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );

    return (
        <div className="upload">
            <Upload
                action={
                    API_URL[process.env.NODE_ENV || 'production'] + '/rest/editor/upload'
                }
                listType="picture-card"
                headers={{
                    token: localStorage.getItem('token') || '',
                }}
                beforeUpload={beforeUpload}
                fileList={fileList}
                onPreview={handlePreview}
                onRemove={handleUploadRemove}
                onChange={handleUploadImg}>
                {fileList.length >= 5 ? null : uploadButton}
            </Upload>
            <span>
                最多上传{max}张图片，单张不超过{size}MB
      </span>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={() => setPreviewVisible(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </div>
    );
}
