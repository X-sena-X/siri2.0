from transformers import pipeline  # Transformers pipeline


class TranslatePipeline:
    def __init__(self):
        self.model_text_to_lang = pipeline("translation", model="facebook/m2m100_418M")

    def translate(self, lang: str, text: str):
        result = self.model_text_to_lang(text, tgt_lang=lang, src_lang="en")

        return result
