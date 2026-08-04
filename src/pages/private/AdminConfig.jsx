import { useState } from 'react';
import { Form, Input, Button, Upload, Card, List, Popconfirm, message, Typography } from 'antd';
import { IoSettingsOutline, IoCloudUploadOutline, IoTrashOutline } from "react-icons/io5";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const { Title, Text } = Typography;

const AdminConfig = () => {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  // 1. Traer la configuración actual de la DB
  const { data: config, isLoading } = useQuery({
    queryKey: ["storeConfig"],
    queryFn: async () => {
      const response = await axios.get("/api/store-config");
      return response.data;
    }
  });

  // 2. Mutación para agregar un nuevo flyer
  const addFlyerMutation = useMutation({
    mutationFn: async (values) => {
      // Si subís el archivo real, acá usarías FormData. 
      // Si usás URLs directas, mandás el objeto directo.
      const formData = new FormData();
      formData.append("alt", values.alt || "");
      formData.append("link", values.link || "");
      if (fileList[0]?.originFileObj) {
        formData.append("image", fileList[0].originFileObj);
      }

      const response = await axios.post("/api/store-config/flyers", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      return response.data;
    },
    onSuccess: () => {
      message.success("¡Flyer subido con éxito!");
      form.resetFields();
      setFileList([]);
      queryClient.invalidateQueries(["storeConfig"]);
    },
    onError: () => message.error("Error al subir el flyer")
  });

  // 3. Mutación para eliminar un flyer
  const deleteFlyerMutation = useMutation({
    mutationFn: async (flyerId) => {
      const response = await axios.delete(`/api/store-config/flyers/${flyerId}`);
      return response.data;
    },
    onSuccess: () => {
      message.success("Flyer eliminado correctamente");
      queryClient.invalidateQueries(["storeConfig"]);
    },
    onError: () => message.error("No se pudo eliminar el flyer")
  });

  const onFinish = (values) => {
    if (fileList.length === 0) {
      return message.warning("Por favor, selecciona o arrastra una imagen primero");
    }
    addFlyerMutation.mutate(values);
  };

  // Bloquea que antd intente hacer el POST automático del componente Upload
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp';
    if (!isJpgOrPng) {
      message.error('¡Solo puedes subir archivos JPG, PNG o WEBP!');
      return Upload.LIST_IGNORE;
    }
    setFileList([file]); // Solo permitimos de a uno
    return false;
  };

  const currentFlyers = config?.homeConfig?.flyers || [];

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fade-in">

      {/* Header de la vista */}
      <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
        <div className="p-3 bg-gray-100 rounded-xl text-slate-700">
          <IoSettingsOutline size={26} />
        </div>
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-800">Ajustes del Sistema</h1>
          <p className="text-sm text-gray-500">Personalizá los banners, flyers y el aspecto visual de la tienda principal.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Columna Izquierda: Formulario de Carga */}
        <div className="lg:col-span-1">
          <Card
            title={<span className="font-bold text-slate-700">Nuevo Banner de Inicio</span>}
            className="shadow-sm rounded-2xl border-gray-100"
          >
            <Form form={form} layout="vertical" onFinish={onFinish}>

              {/* Zona de Arrastre de Imagen */}
              <Form.Item label={<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Imagen del Flyer</span>}>
                <Upload.Dragger
                  name="file"
                  multiple={false}
                  fileList={fileList}
                  beforeUpload={beforeUpload}
                  onRemove={() => setFileList([])}
                  className="bg-gray-50 rounded-xl p-4 border-dashed hover:border-brand-primary"
                >
                  <div className="flex flex-col items-center justify-center py-2 text-gray-400">
                    <IoCloudUploadOutline size={32} className="mb-2 text-gray-400" />
                    <p className="text-xs font-semibold text-gray-600">Hacé click o arrastrá el archivo acá</p>
                    <p className="text-[10px] text-gray-400 mt-1">Soporta PNG, JPG o WEBP</p>
                  </div>
                </Upload.Dragger>

                {/* Especificación técnica estética */}
                <div className="mt-3 bg-amber-50/60 border border-amber-100 rounded-xl p-3">
                  <p className="text-[11px] font-medium text-amber-800 leading-relaxed">
                    ⚠️ <strong>Resolución sugerida:</strong> 1920×1080 píxeles o proporción <strong>16:9</strong> panorámica. Intentá que los textos no queden muy al borde para evitar recortes en celulares.
                  </p>
                </div>
              </Form.Item>

              {/* Campos opcionales */}
              <Form.Item
                name="alt"
                label={<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Texto Alternativo (SEO)</span>}
              >
                <Input placeholder="Ej: Promo Zapatillas Patrician Software - 20% OFF" className="rounded-lg h-10" />
              </Form.Item>

              <Form.Item
                name="link"
                label={<span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ruta de redirección (Opcional)</span>}
              >
                <Input placeholder="Ej: /productos o /admin/descuentos" className="rounded-lg h-10" />
              </Form.Item>

              <Form.Item className="mb-0">
                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={addFlyerMutation.isPending}
                  className="bg-slate-800 hover:bg-slate-700 text-white border-none h-11 rounded-lg font-bold tracking-wide"
                >
                  Guardar y Publicar
                </Button>
              </Form.Item>

            </Form>
          </Card>
        </div>

        {/* Columna Derecha: Lista y ordenamiento de Banners Activos */}
        <div className="lg:col-span-2">
          <Card
            title={
              <div className="flex justify-between items-center w-full">
                <span className="font-bold text-slate-700">Banners Activos actualmente</span>
                <span className="bg-gray-100 px-2.5 py-1 text-xs rounded-full font-bold text-gray-600">
                  {currentFlyers.length} en carrusel
                </span>
              </div>
            }
            loading={isLoading}
            className="shadow-sm rounded-2xl border-gray-100"
          >
            {currentFlyers.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <p className="text-sm">No hay flyers dinámicos configurados.</p>
                <p className="text-xs text-gray-400 mt-1">El slider usará las imágenes por defecto del sistema.</p>
              </div>
            ) : (
              <List
                itemLayout="horizontal"
                dataSource={currentFlyers}
                renderItem={(item, index) => (
                  <List.Item
                    className="p-4 hover:bg-gray-50/50 transition-colors rounded-xl mb-2 border border-gray-100"
                    actions={[
                      <Popconfirm
                        key="delete"
                        title="¿Eliminar este banner?"
                        description="Se quitará inmediatamente del carrusel de inicio."
                        onConfirm={() => deleteFlyerMutation.mutate(item._id || index)}
                        okText="Sí, borrar"
                        cancelText="Cancelar"
                        okButtonProps={{ danger: true }}
                      >
                        <Button
                          type="text"
                          danger
                          icon={<IoTrashOutline size={18} />}
                          className="flex items-center justify-center hover:bg-rose-50 rounded-lg p-2"
                        />
                      </Popconfirm>
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <img
                          src={item.url}
                          alt="Preview"
                          className="w-24 h-14 md:w-32 md:h-18 object-cover rounded-lg shadow-sm border border-gray-100"
                        />
                      }
                      title={<span className="font-bold text-slate-700 text-sm">{item.alt || `Flyer #${index + 1}`}</span>}
                      description={
                        <div className="text-xs text-gray-400 mt-1 space-y-0.5">
                          <p>🔗 Enlace: <span className="font-mono text-gray-600">{item.link || "Ninguno (Solo imagen)"}</span></p>
                          <p>📍 Posición en orden: <span className="font-bold text-gray-700">{index + 1}</span></p>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>

      </div>
    </div>
  );
}

export default AdminConfig;

