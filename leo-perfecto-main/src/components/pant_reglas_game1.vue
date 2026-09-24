<template>
  <div class="space-y-6">
    <div class="bg-white rounded-3xl shadow-xl p-8 md:p-12">
      <div class="flex justify-center mb-6">
        <img src="@/assets/icons/libro-sin-fondo-feliz.png" alt="icono Feliz" class="w-32 h-32" />
      </div>
      
      <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        ¡Primer Desafío!
      </h2>
      
      <div class="text-lg text-gray-600 space-y-4 mb-8">
        <p class="text-center">El objetivo de este juego es reconocer palabras claves en los textos.</p>
        <p class="text-center">Las palabras clave son fundamentales, ya que ayudan a entender la idea global de lo que lees!</p>

        
        <div class="bg-green-50 p-6 rounded-xl">
          <p class="font-semibold mb-3">Estas palabras pueden ser:</p>
          <ul class="space-y-2">
            <li class="flex items-center"><span class="font-bold mr-4">•</span> <strong class="text-blue-600">Sustantivos:</strong>&nbsp;<span>Objetos, nombres de personas, cosas, lugares</span></li>
            <li class="flex items-center"><span class="font-bold mr-4">•</span> <strong class="text-green-600">Verbos:</strong>&nbsp;<span>Acciones que realizan los personajes</span></li>
            <li class="flex items-center"><span class="font-bold mr-4">•</span> <strong class="text-purple-600">Conectores:</strong>&nbsp;<span>Palabras o frases cortas que unen ideas</span></li>
            <li class="flex items-center"><span class="font-bold mr-4">•</span> <strong class="text-yellow-400">Adjetivos:</strong>&nbsp;<span>Palabras que describen caracteristicas importantes</span></li>
          </ul>
        </div>
      </div>
      
      <div class="text-center">
        <button 
          @click="$emit('start')"
          class="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-lg transition-all hover:shadow-lg hover:scale-105"
        >
          Iniciar Juego
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'InstructionsScreen'
}
</script>
