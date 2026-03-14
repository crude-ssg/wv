<?php

class Workflow
{
    private array $workflow;

    public function __construct(string $workflowName)
    {
        $workflowName = str_replace(".json", "", $workflowName) . ".json"; // just in case they pass or don't pass the name with an extension
        $workflowJson = file_get_contents(__DIR__ . '/workflows/' . $workflowName);
        $this->workflow = json_decode($workflowJson, true);
    }

    public function build(GenSettings $settings): array
    {
        // Clone the workflow to avoid modifying the original
        $workflow = $this->workflow;

        // Handle I2V vs T2V mode (currently focusing on I2V as per the workflow)
        if ($settings->mode === Mode::T2V) {
        // T2V mode would need a different workflow structure
        // For now, we'll keep the I2V structure
        }

        $this->updateImage($workflow, $settings->encodedImage);
        $this->updatePrompts($workflow, $settings->positivePrompt);
        $this->updateNegativePrompt($workflow, $settings->negativePrompt);
        $this->updateResolution($workflow, $settings->aspectRatio);
        $this->updateDuration($workflow, $settings->duration);

        return $workflow;
    }

    private function updateImage(array &$workflow, string $encodedImage)
    {
        $result = $this->saveBase64Image($encodedImage);
        if (isset($workflow['97']['inputs']['image'])) {
            $workflow['97']['inputs']['image'] = $result['url'];
        }
    }

    private function saveBase64Image(string $encodedImage): array
    {
        $save_dir = __DIR__ . '/images/';

        // Create directory if it doesn't exist
        if (!is_dir($save_dir)) {
            mkdir($save_dir, 0755, true);
        }

        // Extract the image data and MIME type
        if (preg_match('/^data:image\/(\w+);base64,/', $encodedImage, $matches)) {
            $imageType = $matches[1];
            $base64Data = substr($encodedImage, strpos($encodedImage, ',') + 1);

            // Decode base64 data
            $imageData = base64_decode($base64Data);

            if ($imageData === false) {
                throw new Exception('Invalid base64 image data');
            }

            // Generate a unique filename
            $filename = uniqid() . '.' . $imageType;
            $filepath = $save_dir . $filename;

            // Save the image
            if (file_put_contents($filepath, $imageData) === false) {
                throw new Exception('Failed to save image');
            }

            return [
                'filepath' => $filepath,
                'filename' => $filename,
                'imageType' => $imageType,
                'url' => Config::get('base_api_url') . '/images/' . $filename
            ];
        }
        else {
            throw new Exception('Invalid image format');
        }
    }

    private function updatePrompts(array &$workflow, string $prompt): void
    {
        if(isset($workflow["1581:1564"]['inputs']['custom_prompt'])) {
            $workflow['1581:1564']['inputs']['custom_prompt'] = $prompt;
        }
        
        // Update main prompts
        if (isset($workflow['1592']['inputs']['text'])) {
            $workflow['1592']['inputs']['text'] = $prompt;
        }

        if (isset($workflow['1593']['inputs']['text'])) {
            $workflow['1593']['inputs']['text'] = $prompt;
        }

        if (isset($workflow['1594']['inputs']['text'])) {
            $workflow['1594']['inputs']['text'] = $prompt;
        }

        if (isset($workflow['1595']['inputs']['text'])) {
            $workflow['1595']['inputs']['text'] = $prompt;
        }

        // Update final prompt previews
        if (isset($workflow['1252:1299']['inputs']['text'])) {
            $workflow['1252:1299']['inputs']['text'] = $prompt;
        }

        if (isset($workflow['1262:1269']['inputs']['text'])) {
            $workflow['1262:1269']['inputs']['text'] = $prompt;
        }

        if (isset($workflow['1332:1269']['inputs']['text'])) {
            $workflow['1332:1269']['inputs']['text'] = $prompt;
        }

        if (isset($workflow['1344:1269']['inputs']['text'])) {
            $workflow['1344:1269']['inputs']['text'] = $prompt;
        }
    }

    private function updateNegativePrompt(array &$workflow, string $negativePrompt): void
    {
        $negativeNodes = [
            '1252:1245',
            '1262:1259',
            '1332:1259',
            '1344:1259'
        ];

        foreach ($negativeNodes as $nodeId) {
            if (isset($workflow[$nodeId]['inputs']['text'])) {
                $workflow[$nodeId]['inputs']['text'] = $negativePrompt;
            }
        }
    }

    private function updateResolution(array &$workflow, AspectRatio $aspectRatio): void
    {
        // Target dimensions for different aspect ratios
        // Base width/height for I2V mode
        $dimensions = match ($aspectRatio) {
                AspectRatio::R16_9 => ['width' => 832, 'height' => 480], // 16:9
                AspectRatio::R4_3 => ['width' => 640, 'height' => 480], // 4:3
                AspectRatio::R1_1 => ['width' => 640, 'height' => 640], // 1:1
                AspectRatio::R3_4 => ['width' => 480, 'height' => 640], // 3:4
                AspectRatio::R9_16 => ['width' => 480, 'height' => 832], // 9:16
            };

        // Update FindPerfectResolution node
        if (isset($workflow['1445']['inputs'])) {
            $workflow['1445']['inputs']['desired_width'] = $dimensions['width'];
            $workflow['1445']['inputs']['desired_height'] = $dimensions['height'];
        }
    }

    // Update duration by setting the image_target input of node 1546 (the takes makes the final video)
    private function updateDuration(array &$workflow, Duration $duration): void
    {
        if($duration == Duration::S5) {
            $workflow['1546']['inputs']['image_target'] = ["1252:1249", 0];
            return;
        }

        if($duration == Duration::S10) {
            $workflow['1546']['inputs']['image_target'] = ["1262:1253", 0];
            return;
        }

        if($duration == Duration::S15) {
            $workflow['1546']['inputs']['image_target'] = ["1332:1253", 0];
            return;
        }

        if($duration == Duration::S20) {
            $workflow['1546']['inputs']['image_target'] = ["1344:1253", 0];
            return;
        }
    }

    /**
     * Helper method to get current workflow
     */
    public function getWorkflow(): array
    {
        return $this->workflow;
    }

    /**
     * Helper method to set a specific node's input
     */
    public function setNodeInput(string $nodeId, string $inputName, $value): void
    {
        if (isset($this->workflow[$nodeId]['inputs'][$inputName])) {
            $this->workflow[$nodeId]['inputs'][$inputName] = $value;
        }
    }

    /**
     * Helper method to get a specific node
     */
    public function getNode(string $nodeId): ?array
    {
        return $this->workflow[$nodeId] ?? null;
    }
}