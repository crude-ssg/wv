<?php

abstract class ApiData
{
    /**
     * Convert the object to an associative array.
     */
    public function toArray(): array
    {
        $data = [];

        foreach (get_object_vars($this) as $key => $value) {
            // Recursively convert nested ApiData objects
            if ($value instanceof ApiData) {
                $data[$key] = $value->toArray();
            } elseif (is_array($value)) {
                $data[$key] = array_map(fn($v) => $v instanceof ApiData ? $v->toArray() : $v, $value);
            } else {
                $data[$key] = $value;
            }
        }

        return $data;
    }

    /**
     * Populate the object from an associative array.
     */
    public static function fromArray(array $data): static
    {
        $obj = new static();

        foreach ($data as $key => $value) {
            if (!property_exists($obj, $key)) {
                continue;
            }

            $reflection = new ReflectionProperty($obj, $key);
            $propType = $reflection->getType()?->getName() ?? null;

            // Handle nested ApiData
            if ($propType && class_exists($propType) && is_subclass_of($propType, ApiData::class)) {
                if(is_string($value)) {
                    $value = json_decode($value, true);
                }

                if(is_array($value)) {
                    $obj->$key = $propType::fromArray($value);
                } else {
                    throw new InternalServerError("Invalid value for property {$key}");
                }
            }
            // Handle backed enums (int or string)
            elseif ($propType && enum_exists($propType) && is_subclass_of($propType, \BackedEnum::class)) {
                try {
                    $obj->$key = $propType::from($value);
                } catch (ValueError $e) {
                    // Optionally: fallback to null or throw
                    $obj->$key = null;
                }
            }
            // Handle regular types
            else {
                $obj->$key = $value;
            }
        }

        return $obj;
    }
}