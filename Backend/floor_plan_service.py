import os
import logging

from huggingface_hub import InferenceClient

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

API_TOKEN = os.environ.get("HUGGING_FACE_API_TOKEN")

logger.info(
    f"HUGGING_FACE_API_TOKEN loaded: {'Yes' if API_TOKEN else 'No'}"
)

if API_TOKEN:
    logger.info(f"Token length: {len(API_TOKEN)} characters")
    logger.info(f"Token starts with: {API_TOKEN[:10]}...")


MODELS = {
    "default": "black-forest-labs/FLUX.1-schnell",
    "flux_dev": "black-forest-labs/FLUX.1-dev",
}


def generate_floor_plan(
    prompt: str,
    model_name: str = "default"
):
    if not API_TOKEN:
        logger.error(
            "HUGGING_FACE_API_TOKEN environment variable not set"
        )
        raise ValueError(
            "HUGGING_FACE_API_TOKEN environment variable not set"
        )

    model_path = MODELS.get(
        model_name,
        MODELS["default"]
    )

    logger.info(f"Generating floor plan using model: {model_path}")

    enhanced_prompt = (
        "Professional architectural floor plan, "
        "top-down orthographic technical drawing, "
        f"{prompt}, "
        "architectural CAD style, "
        "clean black and white linework, "
        "clearly separated rooms, "
        "accurate room proportions, "
        "proper walls, doors and windows, "
        "clear room labels, "
        "dimension lines, "
        "architectural symbols, "
        "functional circulation, "
        "professional architectural drafting"
    )

    try:
        client = InferenceClient(
            provider="auto",
            api_key=API_TOKEN,
        )

        image = client.text_to_image(
            prompt=enhanced_prompt,
            model=model_path,
        )

        logger.info(
            f"Successfully generated floor plan using {model_path}"
        )

        # Convert PIL image to PNG bytes
        from io import BytesIO

        image_bytes = BytesIO()
        image.save(image_bytes, format="PNG")

        return image_bytes.getvalue()

    except Exception as e:
        logger.error(
            f"Floor plan generation failed: {str(e)}"
        )

        # Try the second model as fallback
        if model_path != MODELS["flux_dev"]:
            fallback_model = MODELS["flux_dev"]

            logger.info(
                f"Trying fallback model: {fallback_model}"
            )

            try:
                client = InferenceClient(
                    provider="auto",
                    api_key=API_TOKEN,
                )

                image = client.text_to_image(
                    prompt=enhanced_prompt,
                    model=fallback_model,
                )

                logger.info(
                    f"Successfully generated floor plan using "
                    f"fallback model: {fallback_model}"
                )

                from io import BytesIO

                image_bytes = BytesIO()
                image.save(image_bytes, format="PNG")

                return image_bytes.getvalue()

            except Exception as fallback_error:
                logger.error(
                    f"Fallback model also failed: "
                    f"{str(fallback_error)}"
                )

        raise Exception(
            "Floor plan generation failed. "
            "All configured image models failed."
        )