# GPU Instance Template:
https://cloud.vast.ai/template/readme/7ce69ac05cf04c98e891ebeaf72de003

**Note:** All the models and loras can be downloaded directly in comfy ui, just copy the urls and paste it in the corresponding downloader, please make sure to choose the correct path on the downloader, for models the directory is `unet` and for loras the directory is `loras`. for reference these are located in the `ComfyUI/models` directory. if you made a mistake and need to move them around, you can use the `mv` command in the terminal, eg: `mv ComfyUI/models/unet/model.safetensors ComfyUI/models/loras/`.

## To use the Qwen3-VL GGUF Quantized models you have to install llama-cpp-python
- stop comfyui
- activate its venv `source /venv/main/bin/activate`
- install llama-cpp-python `pip install --upgrade --force-reinstall --no-cache-dir "llama-cpp-python @ git+https://github.com/JamePeng/llama-cpp-python.git"`
- restart comfyu

## Autoprompt workflow Models (i2v-autoprompt-workflow.json)

This is the easiest workflow to setup but might be slower then the workflow below.

**Models:** Assign to the HIGH and LOW "Unet Loader (GGUF) `HIGH\LOW` " Nodes respectively. must be placed in the `unet` directory (`ComfyUI/models/unet`)
- HIGH: [wan22RemixI2VGGUFV21_highQ6K.gguf](https://civitai.com/models/2347977?modelVersionId=2641160)
- LOW: [wan22RemixI2VGGUFV21_lowQ6K.gguf](https://civitai.com/models/2347977?modelVersionId=2641158)

## Lighting Worflow Loras (i2v-lighting-workflow):

This needs a few more things to setup but should be faster.

**Models:** Assign to the HIGH and LOW "Unet Loader (GGUF) `HIGH\LOW`" Nodes respectively. must be placed in the `unet` directory (`ComfyUI/models/unet`).
- HIGH: [wan22RemixI2VGGUFV21_highQ6K.gguf](https://civitai.com/models/2347977?modelVersionId=2641160)
- LOW: [wan22RemixI2VGGUFV21_lowQ6K.gguf](https://civitai.com/models/2347977?modelVersionId=2641158)

**SVI Loras:** Assign to the first and second fields on the "Performace Loras" node. must be placed in the `loras` directory (`ComfyUI/models/loras`)
- SVI High: [SVI_v2_PRO_Wan2.2-I2V-A14B_HIGH_lora_rank_128_fp16.safetensors](https://huggingface.co/Kijai/WanVideo_comfy/resolve/main/LoRAs/Stable-Video-Infinity/v2.0/SVI_v2_PRO_Wan2.2-I2V-A14B_HIGH_lora_rank_128_fp16.safetensors)
- SVI Low: [SVI_v2_PRO_Wan2.2-I2V-A14B_LOW_lora_rank_128_fp16.safetensors](https://huggingface.co/Kijai/WanVideo_comfy/resolve/main/LoRAs/Stable-Video-Infinity/v2.0/SVI_v2_PRO_Wan2.2-I2V-A14B_LOW_lora_rank_128_fp16.safetensors)

**Lighting Loras:** Assign to the 3rd and 4th fields on the "Performance Loras" node. must be placed in the `loras` directory (`ComfyUI/models/loras`)
- HIGH: [Wan_2_2_I2V_A14B_HIGH_lightx2v_4step_lora_v1030_rank_64_bf16.safetensors](https://civitai.com/models/1585622?modelVersionId=2361379)
- LOW: [wan2.2_i2v_A14b_low_noise_lora_rank64_lightx2v_4step_1022.safetensors](https://civitai.com/models/1585622?modelVersionId=2337903)

# Reference:
Got all of this from putting together info on [this](https://civitai.com/models/2079192?modelVersionId=2668801) page and some of the pages/links referenced there