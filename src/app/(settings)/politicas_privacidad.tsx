import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { moderateScale, verticalScale } from 'react-native-size-matters';
import { COLOR } from '../../constants/colors';

const PoliticasPrivacidad = () => {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: verticalScale(32) }}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)/settings')}>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Políticas de Privacidad</Text>
        </View>
        <Text style={styles.text}>
          {`Última actualización: 30/06/2025\n\nEn CodeFarm, valoramos y respetamos tu privacidad. Esta Política de Privacidad describe cómo recopilamos, usamos, almacenamos y protegemos tus datos personales de conformidad con la Ley 25.326 de Protección de Datos Personales de la República Argentina y, cuando corresponda, con el Reglamento General de Protección de Datos (GDPR) de la Unión Europea.\n\n1. Responsable del tratamiento\nLa aplicación CodeFarm es desarrollada por [Nombre del equipo o institución universitaria]. Cualquier consulta sobre el tratamiento de tus datos puede realizarse enviando un correo electrónico a [tuemail@ejemplo.com].\n\n2. Datos que recopilamos\nCodeFarm no solicita ni recopila datos personales sensibles. Sin embargo, la app puede recolectar de forma anónima y con fines estadísticos:\n\nLenguaje(s) de programación seleccionados\nCantidad de proyectos creados\nInformación del dispositivo (modelo, versión de sistema operativo)\nLogs de errores o fallos técnicos\n\nNo accedemos, almacenamos ni transmitimos tu código o archivos personales. Toda tu información permanece local en tu dispositivo.\n\n3. Finalidad del tratamiento\nLos datos se utilizan exclusivamente para:\n\nMejorar el rendimiento y la funcionalidad de la app\nIdentificar y corregir errores\nObtener métricas de uso agregadas y anónimas\n\nNo utilizamos tus datos con fines publicitarios ni los compartimos con terceros.\n\n4. Consentimiento\nAl utilizar CodeFarm, el usuario acepta expresamente esta política de privacidad y otorga su consentimiento para el tratamiento de los datos mencionados conforme a la normativa vigente. Podés revocar tu consentimiento en cualquier momento desinstalando la aplicación.\n\n5. Derechos del usuario\nDe acuerdo con la Ley 25.326, tenés derecho a:\n\nAcceder a tus datos personales\nRectificar, actualizar o suprimir tus datos\nRetirar el consentimiento para su tratamiento\n\nPara ejercer estos derechos, podés comunicarte con nosotros a [tuemail@ejemplo.com].\n\nLa AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter de órgano de control de la Ley 25.326, tiene la facultad de atender las denuncias y reclamos que se interpongan con relación al incumplimiento de las normas sobre protección de datos personales.\n\n6. Almacenamiento y seguridad\nLos datos del usuario se almacenan localmente en el dispositivo móvil. Implementamos medidas técnicas y organizativas razonables para proteger dicha información contra accesos no autorizados, pérdida o destrucción.\n\n7. Cambios en esta política\nNos reservamos el derecho a modificar esta Política de Privacidad. Si se realizan cambios sustanciales, se notificará al usuario a través de la app o mediante otros medios adecuados.\n\n8. Contacto\nPara consultas sobre privacidad o tus derechos como usuario, podés escribirnos a:\n📧 [tuemail@ejemplo.com]`}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR.background,
    paddingHorizontal: moderateScale(20),
    paddingTop: verticalScale(16),
  },
  header: {
    paddingTop: verticalScale(32),
    marginBottom: verticalScale(18),
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    padding: moderateScale(10),
  },
  headerTitle: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(20),
    fontWeight: 'bold',
    marginBottom: verticalScale(10),
    textAlign: 'center',
    flex: 1,
  },
  text: {
    color: COLOR.textPrimary,
    fontSize: moderateScale(14),
    lineHeight: 22,
  },
});

export default PoliticasPrivacidad;